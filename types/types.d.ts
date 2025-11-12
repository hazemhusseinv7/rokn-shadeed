interface ImageType {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}
interface HeroType {
  title: string;
  searchInputs?: { label: string }[];
}

interface CategoryType {
  title: string;
  description?: any[];
}

interface AuthorType {
  name: string;
  image?: any;
  bio?: any[];
}
interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage: ImageType;
  publishedAt?: string;
  body: any[];
  author?: AuthorType;
  categories?: CategoryType[];
}
