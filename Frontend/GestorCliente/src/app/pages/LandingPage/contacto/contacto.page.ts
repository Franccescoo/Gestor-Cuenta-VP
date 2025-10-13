import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from 'src/environments/environment';

type ContactForm = FormGroup<{
  email: FormControl<string>;
  subject: FormControl<string>;
  message: FormControl<string>;
}>;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {
  form: ContactForm;
  sending = false;
  sent = false;
  error = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      subject: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      message: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10)],
      }),
    });
  }

  ngOnInit() {
    // Inicializar EmailJS
    emailjs.init({ publicKey: environment.emailjs.publicKey });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.sending = true;
    this.sent = false;
    this.error = false;

    try {
      const { email, subject, message } = this.form.getRawValue();

      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        {
          reply_to: email,
          subject,
          message,
          current_date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      );

      this.sent = true;
      this.form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      this.error = true;
    } finally {
      this.sending = false;
    }
  }
}
