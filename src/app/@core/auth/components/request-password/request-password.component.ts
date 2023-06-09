import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, getDeepFromObject } from '@nebular/auth';

@Component({
  selector: "ngx-request-password",
  templateUrl: "./request-password.component.html",
  styleUrls: ["./request-password.component.scss"],
})
export class RequestPasswordComponent {
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = "";

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router
  ) {
    this.redirectDelay = this.getConfigValue(
      "forms.requestPassword.redirectDelay"
    );
    this.showMessages = this.getConfigValue(
      "forms.requestPassword.showMessages"
    );
    this.strategy = this.getConfigValue("forms.requestPassword.strategy");
  }

  requestPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service
      .requestPassword(this.strategy, this.user)
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;
        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
        }

        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
        this.cd.detectChanges();
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
