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

interface Company {
  logo: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  proof: string;
  category: string;
  tier: string;
}

interface SubCompany {
  logo: string;
  brand: string;
  company: string;
  proof: string;
  category: string;
  tier: string;
}

interface Category {
  en: string;
  ar: string;
}

interface Tier {
  en: string;
  ar: string;
  background: string;
  textColor: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    companies?: Company[];
    subCompanies?: SubCompany[];
    categories?: Category[];
    tiers?: Tier[];
  };
  error?: string;
}
