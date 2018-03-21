import { RenderedData, SecondaryRequestData } from './shared';
import { User } from './user';
import { Image } from './image';

export class Post {
  public id: number;
  public index: number;
  public date: Date;
  public title: RenderedData;
  public content: RenderedData;
  public excerpt: RenderedData;
  public featured_media: number;
  public _links: {
    author: SecondaryRequestData[]
  };
  public expanded = false;
  public authors: User[] = [];
  public previewImage: Image;
}


