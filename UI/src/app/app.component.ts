import { Component } from '@angular/core';
import { BlurEvent, CKEditor5,FocusEvent } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EmailService } from './services/email.service';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UI';
  files: File[] = [];
  public Editor = ClassicEditor;
  public componentEvents: string[] = [];
  public editorData = `<br><br><br>`;
  content: any;
  emailSent!: boolean;
  public to = ''; // Add this line
  public subject = '';
  public emails:string[] =[];
  public body=''


  constructor(private emailService: EmailService,private papa: Papa) {

    this.Editor.defaultConfig = {
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'bulletedList',
          'numberedList',
          'blockQuote',
          '|',
          'insertTable',
          'link',
          'mediaEmbed',
          '|',
          'undo',
          'redo',
          '|',
        ],
      },

      language: 'en',
    };
  }

  onSelect(event:any){
    this.files = event.addedFiles;
    this.parseCsvFile(this.files[0]);
    console.log(event);

  }
  private parseCsvFile(file: File) {
    this.papa.parse(file, {
      complete: (result) => {
        console.log('Parsed CSV:', result.data);
        // Do something with the parsed CSV data
       result.data.forEach((element:any[]) => {
        if(element[30]!='' && element[30] != undefined)
         this.emails.push(element[30])
       });
       console.log(this.emails)
      }
    });
  }

   onRemove(event:any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onBlur(event:BlurEvent){
   console.log(event);
  }
  onFocus(event:FocusEvent){
    console.log(event);
  }
  onChange(event:any){
    this.editorData = event.editor.getData();
    console.log(event);

  }
  onReady(editor: CKEditor5.Editor){
  console.log(editor);
  this.componentEvents.push('The editor is ready.');

  }

  sendmail() {
    this.emailService.sendmail(this.to,this.subject,this.emails,this.editorData).subscribe(() => {
      this.emailSent = true;
      window.alert('Message Sent Successfully');
      console.log('Message Sent Successfully');
    });
  }
}
