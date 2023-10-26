import { Component, OnInit } from '@angular/core';
import { LineOfBusiness } from '../LineOfBusiness';
import { RecentQuote } from '../RecentQuote';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { RefreshService } from '../refresh.service';

@Component({
  selector: 'app-popularLinesOfBusiness',
  templateUrl: './popularLinesOfBusiness.component.html',
  styleUrls: [ './popularLinesOfBusiness.component.css' ]
})
export class PopularLinesOfBusinessComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];
  recentQuotes: RecentQuote[] = [];
  mostCommonQuotes: number[] = [];

  readonly mostCommonQuotesCount = 2; // How many most common quotes to show

  constructor(private lineOfBusinessService: LineOfBusinessService, private refreshService: RefreshService) { 
    this.lineOfBusinessService.getLinesOfBusiness().subscribe(linesOfbusiness => this.getRecentQuotes());
  }

  ngOnInit() {
    this.refreshService.refresh$.subscribe(() => {
      // Trigger the refresh logic in this component
      this.refresh();
    });
  }

  refresh(): void {
    this.getRecentQuotes();
  }

  getLinesOfBusiness(): void {
    this.lineOfBusinessService.getLinesOfBusiness()
      .subscribe(() => {
        this.getMostCommonQuotes(this.mostCommonQuotesCount);
        console.log(this.linesOfBusiness[0].name)
      });
  }

  getRecentQuotes(): void {
    this.lineOfBusinessService.getRecentQuotes()
      .subscribe((recentQuotes:RecentQuote[]) => {
        this.recentQuotes = recentQuotes
        this.getMostCommonQuotes(this.mostCommonQuotesCount);
      });
  }

  getMostCommonQuotes(count:number) {
    // Count occurrences of each id
    const lineOfBusinessCount: { [key: number]: number } = {};
    this.recentQuotes.forEach(recentQuote => {
      const lineOfBusiness = recentQuote.lineOfBusiness;
      lineOfBusinessCount[lineOfBusiness] = (lineOfBusinessCount[lineOfBusiness] || 0) + 1;
    });

    // Sort the lineOfBusinesses by frequency
    const sortedLinesOfBusiness = Object.keys(lineOfBusinessCount).sort((a, b) => lineOfBusinessCount[+b] - lineOfBusinessCount[+a] as number);

    // Get the most and second most frequent ids and set to twoMostCommonQuotes
    this.mostCommonQuotes = [];
    //this.linesOfBusiness = [];
    for(let i = 0; i < this.mostCommonQuotesCount; i++) {
      this.lineOfBusinessService.
        getLineOfBusiness(+sortedLinesOfBusiness[i])
        .subscribe(lineOfBusiness => this.linesOfBusiness[i] = lineOfBusiness);
    }
  }

  updateLinesOfBusiness(): void {
    for(let i = 0; i < this.mostCommonQuotesCount; i++){
      this.lineOfBusinessService.getLineOfBusiness
    }
  }


}
