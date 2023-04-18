import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {CvBanksService} from '../../../../../../../common/includes/services/employer/cv-banks.service';

@Component({
  selector: 'app-cv-bank',
  templateUrl: './cv-bank.component.html',
  styleUrls: ['./cv-bank.component.scss'],
})
export class CvBankComponent implements OnInit {
  cvBanks: Array<{
    categories: Array<{
      fa_icon?: string;
      id: number; title_en: string; cv_count: number
    }>;
    sub_title?: string;
    id: number; title_en: string; title_bn: string
  }> = [];

  moreCVBanks: Array<any> = [];

  isLoading = true;

  constructor(
    public router: Router,
    private spinner: SpinnerService,
    public cvb: CvBanksService,
    public ts: ToastService
  ) {
  }

  ngOnInit(): void {
    this.loadCvBanks();
  }

  loadCvBanks(): void {
    this.spinner.show('cv_bank_spinner');
    this.cvb.initiateCVBanks().then(res => {
      if (res.success) {
        this.cvBanks = res.data.map((x: any) => {
          if (x.id === 1) {
            x.sub_title = 'Get access to your preferred CV according to specific category for a quick and easy hire.';

            const modifiedCategories = x.categories.map((i: any) => {
              i.fa_icon = this.getFaIcon(i.id);
              return i;
            });

            x.categories = modifiedCategories.slice(0, 14);

            this.moreCVBanks.push({
              id: x.id,
              categories: modifiedCategories.slice(15)
            });

          } else if (x.id === 2) {
            x.sub_title = 'Get full access free for a limited time to your preferred CV according to specific category for a quick and easy hire.';

            const modifiedCategories = x.categories.map((i: any) => {
              i.fa_icon = this.getFaIcon(i.id);
              return i;
            });

            x.categories = modifiedCategories.slice(0, 14);

            this.moreCVBanks.push({
              id: x.id,
              categories: modifiedCategories.slice(15)
            });
          }

          return x;
        });
      } else {
        this.ts.apiMessage(res);
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('cv_bank_spinner');
    });
  }

  showLoadMoreOption(id: number): boolean {
    const moreCvBankIndex = this.moreCVBanks.findIndex(element => element.id === id);

    return moreCvBankIndex !== -1;
  }

  loadMoreCvBanks(id: number): void {
    const moreCvBankIndex = this.moreCVBanks.findIndex(element => element.id === id);

    if (moreCvBankIndex !== -1) {
      const cvBankIndex = this.cvBanks.findIndex(element => element.id === id);
      if (cvBankIndex !== -1) {
        this.cvBanks[cvBankIndex].categories = [...this.cvBanks[cvBankIndex].categories, ...this.moreCVBanks[moreCvBankIndex].categories];

        this.moreCVBanks.splice(moreCvBankIndex, 1);
      }
    }
  }


  getFaIcon(value: number): string {
    switch (value) {
      case 1:
        return 'fa fa-address-book';
      case 2:
        return 'fa fa-calculator';
      case 3:
        return 'fa fa-users';
      case 4:
        return 'fa fa-university';
      case 5:
        return 'fa fa-american-sign-language-interpreting';
      case 6:
        return 'fa fa-anchor';
      case 7:
        return 'fa fa-binoculars';
      case 8:
        return 'fa fa-bookmark';
      case 9:
        return 'fa fa-briefcase';
      case 10:
        return 'fa fa-tint';
      case 11:
        return 'fa fa-flask';
      case 12:
        return 'fa fa-bolt';
      case 13:
        return 'fa fa-gavel';
      case 14:
        return 'fa fa-graduation-cap';
      case 15:
        return 'fa fa-wrench';
      case 16:
        return 'fa fa-window-restore';
      case 17:
        return 'fa fa-bars';
      case 18:
        return 'fa fa-user-plus';
      case 19:
        return 'fa fa-user-circle';
      case 20:
        return 'fa fa-trophy';
      case 21:
        return 'fa fa-universal-access';
      case 22:
        return 'fa fa-tags';
      case 23:
        return 'fa fa-taxi';
      case 24:
        return 'fa fa-suitcase';
      case 25:
        return 'fa fa-fax';
      case 26:
        return 'fa fa-tasks';
      case 27:
        return 'fa fa-space-shuttle';
      case 28:
        return 'fa fa-life-ring';
      case 29:
        return 'fa fa-rss-square';
      case 30:
        return 'fa fa-retweet';
      case 31:
        return 'fa fa-rocket';
      case 32:
        return 'fa fa-paw';
      case 33:
        return 'fa fa-magnet';
      case 34:
        return 'fa fa-location-arrow';
      case 35:
        return 'fa fa-wifi';
      case 36:
        return 'fa fa-star';
      case 37:
        return 'fa fa-wheelchair';
      case 38:
        return 'fa fa-filter';
      case 39:
        return 'fa fa-cogs';
      case 40:
        return 'fa fa-arrows';
      case 41:
        return 'fa fa-user-secret';
      case 42:
        return 'fa fa-microchip';
      case 43:
        return 'fa fa-cog';
      case 44:
        return 'fa fa-cubes';
      case 45:
        return 'fa fa-film';
      case 46:
        return 'fa fa-cube';
      case 47:
        return 'fa fa-shopping-bag';
      case 48:
        return 'fa fa-asterisk';
      case 49:
        return 'fa fa-balance-scale';
      case 50:
        return 'fa fa-crop';
      case 51:
        return 'fa fa-random';
      case 52:
        return 'fa fa-share-alt';
      case 53:
        return 'fa fa-bell-slash';
      case 54:
        return 'fa fa-book';
      case 55:
        return 'fa fa-bullhorn';
      case 56:
        return 'fa fa-gift';
      case 57:
        return 'fa fa-coffee';
      case 58:
        return 'fa fa-envelope';
      case 59:
        return 'fa fa-exclamation-circle';
      case 60:
        return 'fa fa-exclamation-triangle';
      case 61:
        return 'fa fa-flag';
      case 62:
        return 'fa fa-fire';
      case 63:
        return 'fa fa-hourglass-half';
      case 64:
        return 'fa fa-info-circle';
      case 65:
        return 'fa fa-retweet';
      case 66:
        return 'fa fa-cogs';
      case 67:
        return 'fa fa-recycle';
      case 68:
        return 'fa fa-rocket';
      case 69:
        return 'fa fa-server';
      case 70:
        return 'fa fa-sitemap';
      case 71:
        return 'fa fa-signal';
      case 72:
        return 'fa fa-trophy';
      case 73:
        return 'fa fa-user-plus';
      case 74:
        return 'fa fa-tree';
      case 75:
        return 'fa fa-assistive-listening-systems';
      case 76:
        return 'fa fa-align-center';
      case 77:
        return 'fa fa-list';
      default:
        return 'fa fa-globe';
    }
  }

}
