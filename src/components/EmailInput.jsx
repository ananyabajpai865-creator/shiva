/* eslint-disable no-unused-vars */
import { useRef, useEffect } from 'react';
import { useWatch } from 'react-hook-form';

export const EmailInput = ({ register, errors, setValue }) => {
  const emailValue = useWatch({ name: 'email' }) || '';
  const datalistRef = useRef(null);

  useEffect(() => {
    const datalist = datalistRef.current;
    if (datalist && emailValue.includes('@') && !emailValue.includes('@gmail.com')) {
      // Clear previous options
      while (datalist.firstChild) datalist.removeChild(datalist.firstChild);
      
      const suggestion = emailValue.split('@')[0] + '@gmail.com';
      const option = document.createElement('option');
      option.value = suggestion;
      datalist.appendChild(option);
    } else if (datalist) {
      // No suggestion
      while (datalist.firstChild) datalist.removeChild(datalist.firstChild);
    }
  }, [emailValue]);

  return (
    <div className="form-group">
      <label>Email ID (Gmail only) *</label>
      <input
        {...register('email')}
        type="email"
        placeholder="example@gmail.com"
        list="email-suggestions"
        autoComplete="off"
      />
      <datalist id="email-suggestions" ref={datalistRef} />
      {errors.email && <span className="error-text">{errors.email.message}</span>}
    </div>
  );
};