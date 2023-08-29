(function () {
  // Read existing preference from local storage or cookies
  var mode = "dark"; // change 'light' to your desired default

  // Set data attribute to the preferred mode
  var attribute = document.createAttribute("data-chakra-ui-color-mode");
  attribute.value = mode;
  document.documentElement.attributes.setNamedItem(attribute);
})();
