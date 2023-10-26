import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { RefreshService } from '../refresh.service';

@Component({
  selector: 'app-lineOfBusiness-detail',
  templateUrl: './lineOfBusiness-detail.component.html',
  styleUrls: [ './lineOfBusiness-detail.component.css' ]
})
export class LineOfBusinessDetailComponent implements OnInit {
  lineOfBusiness: LineOfBusiness | undefined;
  quoteCount: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lineOfBusinessService: LineOfBusinessService,
    private refreshService: RefreshService,
    private location: Location
  ) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.lineOfBusinessService.getLineOfBusiness(id)
      .subscribe(lineOfBusiness => this.lineOfBusiness = lineOfBusiness);
      this.getQuoteCount();
    });
  }

  ngOnInit(): void {
  }

  triggerRefresh(): void {
    // Call the service method to trigger the refresh
    this.refreshService.triggerRefresh();
  }

  navigateToDashboardURL(): void {
    const dashboardURL = '/dashboard'; 
    this.router.navigate([dashboardURL]);
  }

  getLineOfBusiness(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.lineOfBusinessService.getLineOfBusiness(id)
      .subscribe(lineOfBusiness => this.lineOfBusiness = lineOfBusiness);
  }

  getQuoteCount(): void {
    this.lineOfBusinessService.getRecentQuotes()
      .subscribe(recentQuotes => {
        this.quoteCount = recentQuotes.reduce((count, quote) => {
          if (this.lineOfBusiness !== undefined && quote.lineOfBusiness === this.lineOfBusiness.id) {
            return count + 1;
          }
          return count;
        }, 0)
      })
  }

  goBack(): void {
    this.location.back();
  }

  goToDashboard(): void {
    this.navigateToDashboardURL();
  }

  save(): void {
    if (this.lineOfBusiness) {
      this.lineOfBusinessService.updateLineOfBusiness(this.lineOfBusiness)
        .subscribe(() => {
          this.triggerRefresh();
          this.goToDashboard();
        });
    }
  }
}
