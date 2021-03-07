import styled from 'styled-components';

export const Content = styled.div`
  padding: 8px 20px;
`;

export const Post = styled.p`
  text-align: center;
  margin-bottom: 16px;
`;

export const Form = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;

  label {
    text-align: center;
  }

  div#pins_inputs {
    margin-top: 32px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    input {
      letter-spacing: 6px;
      font-size: 48px;
    }
  }
`;
