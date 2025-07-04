import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { apiService } from './apiService';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginResponse {
  user: AuthUser;
  backendUser: any;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Obtener el token de Firebase
      const token = await firebaseUser.getIdToken();

      // Guardar el token ANTES de hacer cualquier llamada al backend
      localStorage.setItem('authToken', token);
      localStorage.setItem('firebaseUid', firebaseUser.uid);

      // Crear el objeto de usuario autenticado
      const authUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        token
      };

      // Buscar el usuario en el backend
      try {
        const backendUser = await apiService.get(`/users/firebase/${firebaseUser.uid}`);
        return { user: authUser, backendUser };
      } catch (error) {
        console.warn('Usuario no encontrado en backend:', error);
        // Si no existe en el backend, aún podemos continuar con el usuario de Firebase
        return { user: authUser, backendUser: null };
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(this.getFirebaseErrorMessage(error.code));
    }
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const firebaseUser = userCredential.user;

      // Actualizar el perfil con el nombre completo
      await updateProfile(firebaseUser, {
        displayName: data.fullName
      });

      // Obtener el token
      const token = await firebaseUser.getIdToken();

      // Guardar token ANTES de hacer llamadas al backend
      localStorage.setItem('authToken', token);
      localStorage.setItem('firebaseUid', firebaseUser.uid);

      // Crear el objeto de usuario
      const authUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: data.fullName,
        token
      };

      // Crear usuario en el backend
      const backendUser = await apiService.post('/users', {
        firebase_uid: firebaseUser.uid,
        full_name: data.fullName
      });

      return { user: authUser, backendUser };

    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(this.getFirebaseErrorMessage(error.code));
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      localStorage.removeItem('firebaseUid');
      localStorage.removeItem('selectedBusinessId');
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  async refreshToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true); // force refresh
      localStorage.setItem('authToken', token);
      return token;
    }
    return null;
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No existe una cuenta con este email.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada.';
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con este email.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde.';
      default:
        return 'Error de autenticación. Intenta nuevamente.';
    }
  }
}

export const authService = new AuthService();
