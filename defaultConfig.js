SMITHEREEN_DEFAULT_CONFIG = {
  "replacements": {
    "{client-name}": [
      "capitalize(firstWord(getNodeValue(findNode('.a-case-tab:not(.ui-tabs-hide) .case_customer_tab .a-details'))))",
      "capitalize(firstWord(findRegex(findNodes('.customer_history_ticket_email_body'), 'Name:\\s*([a-zA-Z-]+)', 1)))"
    ]
  }
}

