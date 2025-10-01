import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest, UserRole } from '../../models/user.interface';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  registerData: RegisterRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: UserRole.CUSTOMER
  };

  confirmPassword = '';
  agreeToTerms = false;
  receiveNewsletter = false;

  loading = false;
  errorMessage = '';
  successMessage = '';

  emailError = '';
  passwordError = '';
  confirmPasswordError = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  validateEmail(): boolean {
    this.emailError = '';

    if (!this.registerData.email) {
      this.emailError = 'Email is required';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.emailError = 'Please enter a valid email address';
      return false;
    }

    return true;
  }

  validatePassword(): boolean {
    this.passwordError = '';

    if (!this.registerData.password) {
      this.passwordError = 'Password is required';
      return false;
    }

    if (this.registerData.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      return false;
    }

    // Check for at least one uppercase, one lowercase, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(this.registerData.password)) {
      this.passwordError = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      return false;
    }

    return true;
  }

  validatePasswordMatch(): boolean {
    this.confirmPasswordError = '';

    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password';
      return false;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      return false;
    }

    return true;
  }

  isFormValid(): boolean {
    return !!(
      this.registerData.firstName &&
      this.registerData.lastName &&
      this.registerData.email &&
      this.registerData.password &&
      this.confirmPassword &&
      this.registerData.password === this.confirmPassword &&
      this.agreeToTerms &&
      !this.emailError &&
      !this.passwordError &&
      !this.confirmPasswordError
    );
  }

  onSubmit() {
    // Clear messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate all fields
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    const isPasswordMatchValid = this.validatePasswordMatch();

    if (!isEmailValid || !isPasswordValid || !isPasswordMatchValid) {
      return;
    }

    if (!this.agreeToTerms) {
      this.errorMessage = 'Please agree to the terms and conditions';
      return;
    }

    this.loading = true;

    // Update notification preferences based on newsletter checkbox
    const registrationData = {
      ...this.registerData,
      notificationsEnabled: this.receiveNewsletter
    };

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Account created successfully! Redirecting to login...';

        // Clear form
        this.registerData = {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          role: UserRole.CUSTOMER
        };
        this.confirmPassword = '';
        this.agreeToTerms = false;
        this.receiveNewsletter = false;

        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}