export interface StorySlide {
  image: string;
  text: string;
  textStyle: 'red-white' | 'white-black';
  showOverlay?: boolean;
}

export interface WebStory {
  id: string;
  title: string;
  coverImage: string;
  coverTitle: string;
  coverStyle: 'red-white' | 'white-black';
  slides: StorySlide[];
}

export const storiesData: WebStory[] = [];
