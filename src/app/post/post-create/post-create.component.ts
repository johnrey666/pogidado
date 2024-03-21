import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
    enteredTitle = '';
    enteredContent = '';
    enteredImageUrl = ''; // To store the image URL from the input
    uploadedImageUrl = ''; // To store the image URL from the uploaded file

    constructor(public postsService: PostService) {}

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file) {
                // Here you would typically upload the file to a server and get a URL
                // For demonstration, we'll just read the file as a Data URL
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    // Assuming you want to set the uploadedImageUrl to the Data URL
                    this.uploadedImageUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return;
        }
        // Extract title, content, and imageUrl from the form
        const title = form.value.title;
        const content = form.value.content;
        let imageUrl = form.value.imageUrl; // Extract the image URL from the input

        // If an image was uploaded, use the uploaded image URL instead
        if (this.uploadedImageUrl) {
            imageUrl = this.uploadedImageUrl;
        }

        // Call the addPost method with the extracted values
        this.postsService.addPost(title, content, imageUrl).subscribe(() => {
            form.resetForm();
            // Reset the uploadedImageUrl to clear the previous upload
            this.uploadedImageUrl = '';
        });
    }
}