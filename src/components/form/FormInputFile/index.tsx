import React, { InputHTMLAttributes } from 'react';

// https://www.pluralsight.com/guides/how-to-use-a-simple-form-submit-with-files-in-react

import { Input, Error } from './styles';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | undefined;
  fontSize?: number;
  /* register?: any;
  onFileSelectSuccess?(file: File): void;
  onFileSelectError?(): void;
  onFileSelect(e: any): void; */
}

const FormInput: React.FC<IProps> = ({
  disabled,
  error,
  /* register,
  fontSize = 14,
  onFileSelect, */
  ...rest
}) => {
  // const fileInput = useRef(null);

  // const handleFileInput = (e): void => {
  //   handle validations
  //   onFileSelect(e.target.files[0]);
  //   const file = e.target.files[0];
  //   if (file.size > 1024)
  //     onFileSelectError({ error: 'File size cannot exceed more than 1MB' });
  //   else onFileSelectSuccess(file);
  // };
  return (
    <>
      <Input
        {...rest}
        type="file"
        className={`${disabled && 'disabled'}`}
        disabled={disabled}
        /* ref={register} */
        error={error}
      />
      {/* <button
        onClick={(e) => fileInput.current && fileInput.current.click()}
        className="btn btn-primary"
      /> */}

      {error && <Error>{error}</Error>}
    </>
  );
};

export default FormInput;
