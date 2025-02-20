export interface TableColumn {
  headerId: string;
  primaryText: string;
  secundaryText?: string;
  avatar?: {
    type: 'name' | 'image';
    name?: string;
    src?: string;
    size: 'xs' | 'sm' | 'md' | 'lg';
  };
}
