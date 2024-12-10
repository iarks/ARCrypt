window._site = {

    addClass: (element, className) => {
        document.getElementById(element).classList.add(className);
    },
    addStyle: (element, style) => {
        document.getElementById(element).setAttribute("style", style);
    },
    showModal: (id, x) => {
        const myModal = new bootstrap.Modal(document.getElementById(id), {});
        myModal.show();
    }
}
