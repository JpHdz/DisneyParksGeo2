import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledOtherFormLink = styled.p`
  text-align: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--blue-main);
  font-weight: 700;
`;

function OtherFormLink({ otherFormLink, otherFormLinkText, otherFormText }) {
  return (
    <StyledOtherFormLink className="dont-have-acc">
      {otherFormText}{" "}
      <StyledLink to={otherFormLink}>{otherFormLinkText}</StyledLink>
    </StyledOtherFormLink>
  );
}

export default OtherFormLink;
