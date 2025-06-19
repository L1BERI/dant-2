const quizData = [
    {
        question: "На что жалуетесь?",
        type: "image-card",
        answers: [
            { text: "Зуб болит (либо ноет)", value: "pain", img: "./assets/quiz/1.jpg" },
            { text: "Опухает щека (флюс)", value: "swelling", img: "./assets/quiz/2.jpg" },
            { text: "Скололась пломба", value: "plomba", img: "./assets/quiz/3.jpg" },
            { text: "Зуб разрушился", value: "destroyed", img: "./assets/quiz/4.jpg" },
            { text: "Зуб болит при надкусывании", value: "bite_pain", img: "./assets/quiz/5.jpg" },
            { text: "Застревает пища", value: "food", img: "./assets/quiz/6.jpg" },
            { text: "Точно знаю от другого стоматолога, что у меня — киста", value: "cyst", img: "./assets/quiz/7.jpg" },
            { text: "У меня ребёнок — подросток с плохо вылеченным зубом, которому ещё рано удалять зуб и ставить имплант", value: "child", img: "./assets/quiz/8.jpg" },
            { text: "Другой запрос", value: "other", img: null }
        ]
    },
    {
        question: "Лечили ли ранее этот зуб?",
        type: "card",
        answers: [
            { text: "Да", value: "yes" },
            { text: "Нет", value: "no" },
            { text: "Не помню", value: "dont_remember" }
        ]
    },
    {
        question: "Когда хотите приступить к лечению?",
        type: "card",
        answers: [
            { text: "Как можно скорее", value: "asap" },
            { text: "В течение недели", value: "week" },
            { text: "В течение месяца", value: "month" },
            { text: "Позднее", value: "later" },
            { text: "Ещё не знаю / Нужна консультация", value: "consult" }
        ]
    },
    { type: "form" }
];

class Quiz {
    constructor(root) {
        this.root = root;
        this.currentStep = 0;
        this.answers = {};
        this.init();
    }

    init() {
        this.quizContainer = this.root;
        this.quizInner = this.root.querySelector('.quiz__inner');
        this.nextButton = this.root.querySelector('[data-quiz-next]');
        this.prevButton = this.root.querySelector('[data-quiz-prev]');
        this.questionElement = this.root.querySelector('[data-quiz-question]');
        this.answersList = this.root.querySelector('.quiz__answers');
        this.stepElement = this.root.querySelector('[data-quiz-start-step]');
        this.progressBar = this.root.querySelector('.quiz__bar-complete');
        this.contactForm = this.root.querySelector('.contact-form');

        this.nextButton.addEventListener('click', () => this.handleNext());
        this.prevButton.addEventListener('click', () => this.handlePrev());
        this.renderQuestion();
        this.updateProgress();
        this.updateNavigationButtons();
    }

    renderQuestion() {
        const currentQuestion = quizData[this.currentStep];
        if (currentQuestion.type === 'form') {
            this.showContactForm();
            return;
        }
        this.questionElement.textContent = currentQuestion.question;
        this.answersList.innerHTML = '';

        this.questionElement.style.animation = 'none';
        this.questionElement.offsetHeight;
        this.questionElement.style.animation = 'slideIn 0.5s ease-out';

        if (currentQuestion.type === 'image-card') {
            this.answersList.classList.add('quiz__answers--grid');
            currentQuestion.answers.forEach((answer, index) => {
                const li = document.createElement('li');
                li.className = 'quiz__answers-item quiz__answers-item--card';
                li.style.animationDelay = `${index * 0.05}s`;
                li.innerHTML = `
                    <div class="quiz__answers-item--card-inner">
                        <label class="custom-radio-card">
                            <input type="radio" name="answer" value="${answer.value}">
                            <span class="radio-visual"></span>
                            ${answer.img ? `<img src='${answer.img}' width="100" height="100" alt='' class='quiz-card-img'>` : ''}
                            <span class="answer-text">${answer.text}</span>
                        </label>
                    </div>
                `;
                this.answersList.appendChild(li);
            });
        } else if (currentQuestion.type === 'card') {
            this.answersList.classList.remove('quiz__answers--grid');
            currentQuestion.answers.forEach((answer, index) => {
                const li = document.createElement('li');
                li.className = 'quiz__answers-item quiz__answers-item--card';
                li.style.animationDelay = `${index * 0.05}s`;
                li.innerHTML = `
                    <div class="quiz__answers-item--card-inner">
                        <label class="custom-radio-card">
                            <input type="radio" name="answer" value="${answer.value}">
                            <span class="radio-visual"></span>
                            <span class="answer-text">${answer.text}</span>
                        </label>
                    </div>
                `;
                this.answersList.appendChild(li);
            });
        }
    }

    updateProgress() {
    
        const progress = ((this.currentStep + 1) / (quizData.length - 1)) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.stepElement.textContent = this.currentStep + 1;
    }

    handleNext() {
        const selectedAnswer = this.root.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) {
            this.showError('Пожалуйста, выберите ответ');
            return;
        }
        const answerText = selectedAnswer.closest('label').querySelector('.answer-text')?.textContent || selectedAnswer.value;
        this.answers[`question${this.currentStep + 1}`] = answerText;
        let hiddenInput = this.root.querySelector(`input[name="question${this.currentStep + 1}"]`);
        if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = `question${this.currentStep + 1}`;
            this.root.querySelector('form')?.appendChild(hiddenInput);
        }
        hiddenInput.value = answerText;
        if (this.currentStep < quizData.length - 2) {
            this.currentStep++;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        } else {
            this.currentStep++;
            this.renderQuestion();
            this.updateNavigationButtons();
        }
    }

    handlePrev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#f50007';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.marginTop = '10px';
        errorDiv.style.animation = 'fadeIn 0.3s ease-out';

        const existingError = this.quizContainer.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        this.quizContainer.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    showContactForm() {
        this.quizInner.style.animation = 'fadeIn 0.5s ease-out reverse';
        setTimeout(() => {
            this.quizInner.style.display = 'none';
            this.contactForm.style.display = 'flex';
        }, 500);
    }

    updateNavigationButtons() {
        this.prevButton.style.display = this.currentStep > 0 ? 'block' : 'none';
        this.nextButton.style.dblockay = this.currentStep < quizData.length - 1 ? 'block' : 'none';
    }

    syncAnswersToForm() {
        const form = this.root.querySelector('form');
        if (!form) return;
       
        Array.from(form.querySelectorAll('input[type="hidden"][name^="question"]')).forEach(input => input.remove());
       
        Object.entries(this.answers).forEach(([key, value]) => {
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.quiz').forEach(quizEl => {
        const quizInstance = new Quiz(quizEl);
        quizEl.__quizInstance = quizInstance;
    });

   
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
 
    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const quizRoot = form.closest('.quiz');
        
        if (quizRoot && quizRoot.__quizInstance) {
            quizRoot.__quizInstance.syncAnswersToForm();
        }
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
    document.querySelectorAll('[data-quiz-form], [data-reception-form], [data-call-form]').forEach(form => {
        form.removeEventListener('submit', handleFormSubmit); 
        form.addEventListener('submit', handleFormSubmit);
    });


    const modal = document.querySelector('[data-calc-modal]');
    const openBtn = document.querySelector('[data-calc-btn]');
    const closeBtn = modal.querySelector('[modal-quiz-close]');

  
    modal.style.display = 'none';
    modal.classList.remove('modal-quiz--visible', 'modal-quiz--hide');

    function openModal() {
        modal.style.display = 'flex';
      
        void modal.offsetWidth;
        modal.classList.add('modal-quiz--visible');
        modal.classList.remove('modal-quiz--hide');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.classList.remove('modal-quiz--visible');
        modal.classList.add('modal-quiz--hide');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
   
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    
    const receptionModal = document.querySelector('[data-reception-modal]');
    const receptionOpenBtns = document.querySelectorAll('[data-reception-btn]');
    const receptionCloseBtn = receptionModal.querySelector('[modal-reception-close]');

    
    receptionModal.style.display = 'none';
    receptionModal.classList.remove('modal-quiz--visible', 'modal-quiz--hide');

    function openReceptionModal() {
        receptionModal.style.display = 'flex';
        void receptionModal.offsetWidth;
        receptionModal.classList.add('modal-quiz--visible');
        receptionModal.classList.remove('modal-quiz--hide');
        document.body.style.overflow = 'hidden';
    }
    function closeReceptionModal() {
        receptionModal.classList.remove('modal-quiz--visible');
        receptionModal.classList.add('modal-quiz--hide');
        setTimeout(() => {
            receptionModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }
    receptionOpenBtns.forEach(btn => btn.addEventListener('click', openReceptionModal));
    receptionCloseBtn.addEventListener('click', closeReceptionModal);
    receptionModal.addEventListener('click', (e) => {
        if (e.target === receptionModal) closeReceptionModal();
    });

   
    const callModal = document.querySelector('[data-call-modal]');
    const callOpenBtns = document.querySelectorAll('[data-call-btn]');
    const callCloseBtn = callModal.querySelector('[modal-call-close]');

 
    callModal.style.display = 'none';
    callModal.classList.remove('modal-quiz--visible', 'modal-quiz--hide');

    function openCallModal() {
        callModal.style.display = 'flex';
        void callModal.offsetWidth;
        callModal.classList.add('modal-quiz--visible');
        callModal.classList.remove('modal-quiz--hide');
        document.body.style.overflow = 'hidden';
    }
    function closeCallModal() {
        callModal.classList.remove('modal-quiz--visible');
        callModal.classList.add('modal-quiz--hide');
        setTimeout(() => {
            callModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }
    callOpenBtns.forEach(btn => btn.addEventListener('click', openCallModal));
    callCloseBtn.addEventListener('click', closeCallModal);
    callModal.addEventListener('click', (e) => {
        if (e.target === callModal) closeCallModal();
    });
}); 