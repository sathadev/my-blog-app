export interface Post {
  id: string;
  title: string;
  content: string;
  creator: { _id: string, email: string };
}