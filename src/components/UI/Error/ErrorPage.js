import React from "react";
import {
  ErrorScreenWrapper,
  StyledButton,
  ErrorTitle,
} from "./style";
import {
  USER_PANEL_MODULE_URL,
  USER_MODULE_URL,
  BREADCRUMBS_HOME,
  BACK_BTN_TEXT,
} from "../../../config/Constants";

export default function ErrorPage({ title, description, isReturn }) {
  return (
    <ErrorScreenWrapper>
      <ErrorTitle>{title}</ErrorTitle>
      <p>{description}</p>

      <StyledButton
        variant="contained"
        color="secondary"
        href={USER_PANEL_MODULE_URL}
      >
        {BREADCRUMBS_HOME}
      </StyledButton>
      {isReturn && (
        <StyledButton
          variant="contained"
          color="primary"
          href={USER_MODULE_URL}
        >
          {BACK_BTN_TEXT}
        </StyledButton>
      )}
    </ErrorScreenWrapper>
  );
}
