// Открытие и закрытие модалки политики

document.addEventListener('DOMContentLoaded', function() {
    const privacyModal = document.querySelector('[data-call-modal]');
    const openBtns = document.querySelectorAll('[data-call-btn]');
    const closeBtn = privacyModal?.querySelector('[modal-call-close]');

    if (privacyModal) {
        privacyModal.style.display = 'none';
        privacyModal.classList.remove('modal-quiz--visible', 'modal-quiz--hide');
    }

    function openPrivacyModal() {
        privacyModal.style.display = 'flex';
        void privacyModal.offsetWidth;
        privacyModal.classList.add('modal-quiz--visible');
        privacyModal.classList.remove('modal-quiz--hide');
        document.body.style.overflow = 'hidden';
    }
    function closePrivacyModal() {
        privacyModal.classList.remove('modal-quiz--visible');
        privacyModal.classList.add('modal-quiz--hide');
        setTimeout(() => {
            privacyModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }
    openBtns.forEach(btn => btn.addEventListener('click', openPrivacyModal));
    closeBtn?.addEventListener('click', closePrivacyModal);
    privacyModal?.addEventListener('click', (e) => {
        if (e.target === privacyModal) closePrivacyModal();
    });

    // --- Отправка формы политики ---
    function validatePhone(phone) {
        const cleaned = phone.replace(/[^\d]/g, '');
        return cleaned.length >= 10;
    }
    function showFormMessage(form, message, isError = false) {
        let msg = form.querySelector('.form-message');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'form-message';
            form.appendChild(msg);
        }
        msg.textContent = message;
        msg.style.color = isError ? '#f50007' : '#24D3BF';
        msg.style.textAlign = 'center';
        msg.style.marginTop = '10px';
        msg.style.fontSize = '16px';
        msg.style.fontFamily = 'var(--font-family)';
        msg.style.animation = 'fadeIn 0.3s';
        msg.style.opacity = '1';
        setTimeout(() => { msg.style.opacity = '0'; }, 4000);
    }

    function handlePrivacyFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const phoneInput = form.querySelector('input[name="phone"]') || form.querySelector('input[type="tel"]');
        const agreeInput = form.querySelector('input[name="agree"], input[name="politic"]');
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const isAgree = agreeInput ? agreeInput.checked : true;
        if (!phone || !validatePhone(phone)) {
            showFormMessage(form, 'Введите корректный телефон (минимум 10 цифр)', true);
            phoneInput && phoneInput.focus();
            return;
        }
        if (!isAgree) {
            showFormMessage(form, 'Необходимо согласие на обработку данных', true);
            agreeInput && agreeInput.focus();
            return;
        }
        
        const formData = new FormData(form);
        const dataObj = {};
        formData.forEach((value, key) => { dataObj[key] = value; });
     
        fetch('send.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.ok ? res.text() : Promise.reject(res.status))
        .then(() => {
            showFormMessage(form, 'Спасибо! Мы свяжемся с вами в ближайшее время.');
            form.reset();
            setTimeout(() => {
                window.location.href = 'thanks.html';
            }, 800);
        })
        .catch(() => {
            showFormMessage(form, 'Ошибка отправки. Попробуйте позже.', true);
        })
    }
    document.querySelectorAll('[data-call-form]').forEach(form => {
        form.addEventListener('submit', handlePrivacyFormSubmit);
    });
});
