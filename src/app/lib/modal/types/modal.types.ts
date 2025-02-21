import { sizesModal, typeModal, typeOverflow } from '../const';

export type SizeModal = (typeof sizesModal)[keyof typeof sizesModal];
export type TypeModal = (typeof typeModal)[keyof typeof typeModal];
export type TypeOverflow = (typeof typeOverflow)[keyof typeof typeOverflow];

// export type TypeOverflow = keyof typeof typeOverflow;
// export type TypeModal = keyof typeof typeModal;
// export type SizeModal = keyof typeof sizesModal;
