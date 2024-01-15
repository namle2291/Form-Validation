function Validator(options) {
  const formElement = document.querySelector(options.form);
  const rules = options.rules;

  let ruleSelectors = {};

  function validate(inputEl, rule) {
    let message;

    for (let i = 0; i < ruleSelectors[rule.selector].length; i++) {
      message = ruleSelectors[rule.selector][i](inputEl.value);
      if (message) break;
    }

    let errElement = inputEl.parentElement.querySelector("span");
    errElement.innerText = message ? message : "";
  }

  if (formElement) {
    rules.forEach((rule) => {
      let input = document.querySelector(rule.selector);

      if (Array.isArray(ruleSelectors[rule.selector])) {
        ruleSelectors[rule.selector].push(rule.test);
      } else {
        ruleSelectors[rule.selector] = [rule.test];
      }

      input.onblur = () => {
        validate(input, rule);
      };

      input.oninput = () => {
        let errElement = input.parentElement.querySelector("span");
        errElement.innerText = "";
      };
    });
  }
}

// Rules

Validator.isRequired = (selector, message) => {
  return {
    selector,
    test: (value) => {
      return value.trim() ? undefined : message || "Vui lòng điền trường này!";
    },
  };
};

Validator.isEmail = (selector, message) => {
  return {
    selector,
    test: (value) => {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || "Email không hợp lệ!";
    },
  };
};

Validator.minLength = (selector, min) => {
  return {
    selector,
    test: (value) => {
      return value.length >= min
        ? undefined
        : `Mật khẩu tối thiểu ${min} chữ cái`;
    },
  };
};

Validator.isConfirmed = (selector, callback, message) => {
  return {
    selector,
    test: (value) => {
      return value.trim() === callback() ? undefined : message;
    },
  };
};
