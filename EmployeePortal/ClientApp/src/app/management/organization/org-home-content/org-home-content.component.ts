import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeContentService } from '../../../services/home-content.service';

@Component({
  selector: 'app-org-home-content',
  templateUrl: './org-home-content.component.html',
  styleUrls: ['./org-home-content.component.less']
})
export class OrgHomeContentComponent implements OnInit {
  file: File;
  homePageContentFile: File;
  homePageContentUploaded = false;

  constructor(private homeContentService: HomeContentService) {}

  ngOnInit() {
  }

  /**
   * this is used to trigger the input
  */
  openHomePageContentInput() {
    document.getElementById('homePageContentFileInput').click();
  }

  homePageContentFileChange(files: File[]) {
    if (files.length > 0) {
      this.homePageContentFile = files[0];
      this.homePageContentUploaded = false;
    }
  }

   /**
   * this is used to perform the actual upload
   */
  uploadHomePageContent() {
    const formData = new FormData();
    const myNewFile = new File([this.homePageContentFile], this.homePageContentFile.name, {type: this.homePageContentFile.type});
    formData.append(myNewFile.name, myNewFile);
    this.homeContentService.uploadContent(formData).subscribe(res => { });
    this.homePageContentUploaded = true;
    this.homePageContentFile = null;
  }
}



