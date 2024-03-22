export interface Post {
    _id: string;
    title: string;
    content: string;
    imageUrl: string;
    file: string; // Assuming you want to store the file name or a reference
}