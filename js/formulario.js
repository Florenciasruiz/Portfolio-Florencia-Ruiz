document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector("#signup");
    const successMessage = document.querySelector("#successMessage");
    const errorMessage = document.querySelector("#errorMessage");

    const NAME_REQUIRED = "Por favor, ingresa tu nombre";
    const EMAIL_REQUIRED = "Por favor, ingresa tu email";
    const EMAIL_INVALID = "Por favor, ingresa un email válido";
    const MESSAGE_REQUIRED = "Por favor, ingresa un mensaje";

    function showMessage(input, message, type) {
        const msg = input.parentNode.querySelector("small");
        msg.innerText = message;
        input.className = type ? "form-control form-control-lg success" : "form-control form-control-lg error";
        return type;
    }

    function showError(input, message) {
        return showMessage(input, message, false);
    }

    function showSuccess(input) {
        return showMessage(input, "", true);
    }

    function hasValue(input, message) {
        if (input.value.trim() === "") {
            return showError(input, message);
        }
        return showSuccess(input);
    }

    function validateEmail(input, requiredMsg, invalidMsg) {
        if (!hasValue(input, requiredMsg)) {
            return false;
        }
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const email = input.value.trim();
        if (!emailRegex.test(email)) {
            return showError(input, invalidMsg);
        }
        return true;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let nameValid = hasValue(form.elements["name"], NAME_REQUIRED);
        let emailValid = validateEmail(form.elements["email"], EMAIL_REQUIRED, EMAIL_INVALID);
        let messageValid = hasValue(form.elements["message"], MESSAGE_REQUIRED);

        if (nameValid && emailValid && messageValid) {
            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                },
                timeout: 20000 // Tiempo de espera de 20 segundos
            })
            .then(response => {
                if (response.ok) {
                    console.log('Formulario enviado con éxito');
                    successMessage.textContent = "¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.";
                    successMessage.style.display = "block";
                    errorMessage.style.display = "none";
                    form.reset(); // Limpia los campos del formulario
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            })
            .catch(error => {
                console.error('Error al enviar el formulario:', error);
                errorMessage.textContent = "Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.";
                errorMessage.style.display = "block";
                successMessage.style.display = "none";
            });
        }
    });

    form.addEventListener("input", function (event) {
        switch (event.target.id) {
            case "name":
                hasValue(event.target, NAME_REQUIRED);
                break;
            case "email":
                validateEmail(event.target, EMAIL_REQUIRED, EMAIL_INVALID);
                break;
            case "message":
                hasValue(event.target, MESSAGE_REQUIRED);
                break;
        }
    });
});