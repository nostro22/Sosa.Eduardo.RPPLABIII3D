export const validarCampoVacio = (e) => {
    const input = e.target;
    input.value.trim() ? clearError(input) : setError(input, "Campo requerido");
};
export const validarChecked = (e) => {
    const $fielsetAccesorios = document.forms[0].querySelector("#field_accesorios");
    const $accesorios = document.forms[0].querySelectorAll(".accesorios");
    console.log($fielsetAccesorios);
    if ($accesorios[0].checked || $accesorios[1].checked || $accesorios[2].checked|| $accesorios[3].checked) {
        clearError($fielsetAccesorios);
    }
    else{
        setError($fielsetAccesorios, "Campo requerido");
    }
};

export const validarLongitudMaxima = (e) => {
    const input = e.target;
    if (e.target.value) {
        input.value.trim().length < 25 ? clearError(input) : setError(input, "Longitud maxima de 25 excedida");

    }
    else {
        setError(input, "Campo requerido");
    }
}

export const validarPrecio = (e) => {
    const input = parseFloat(e.target.value);

    if (input >= 0 && input < 50001 && input != isNaN) {
        clearError(e.target);
    }
    else {
        setError(e.target, "precio Invalido 0-50000 premitido");
    }
}

const setError = (input, mensaje) => {
    const $small = input.nextElementSibling;
    $small.textContent = mensaje || `${input.name} requerido`;
    input.classList.remove("correcto");
    input.classList.add("inputError");
    $small.classList.add("danger");
};
const clearError = (input, mensaje) => {
    const $small = input.nextElementSibling;
    input.classList.add("correcto");
    $small.textContent = "";
    input.classList.remove("inputError");
    $small.classList.remove("danger");
};
