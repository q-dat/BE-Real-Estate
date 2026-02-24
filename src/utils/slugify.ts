import slugifyLib from 'slugify';

export const slugify = (text: string): string => {
  const normalized = text.replace(/\//g, '-');

  return slugifyLib(normalized, {
    lower: true,
    strict: true,
    trim: true,
    locale: 'vi'
  });
};

// const test = slugify('123 test/slugify');
// alert(test);
