document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const formulario = document.getElementById('formulario');
    const nomeInput = document.querySelector('input[name="nome"]');
    const idadeInput = document.querySelector('input[name="idade"]');
    const countrySelect = document.getElementById('country-select'); // Renomeado para countrySelect para consistência
    const stateSelect = document.getElementById('state-select');     // Renomeado para stateSelect para consistência
    const motivoButtons = document.querySelectorAll('.motivo-button');
    const motivoInput = document.getElementById('motivoInput');
    const whatsappInput = document.querySelector('input[name="whatsapp"]');
    const horariosTextarea = document.querySelector('textarea[name="horarios"]');
    const aceiteTermosCheckbox = document.getElementById('aceitoTermos');
    const botaoEnviar = document.getElementById('botaoEnviar');

    // --- Funções para PAÍSES e ESTADOS ---
    async function loadCountries() {
        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/capital');
            const data = await response.json();

            if (data && data.data && data.data.length > 0) {
                countrySelect.innerHTML = '<option value="">Selecione um país</option>';
                data.data.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.name;
                    option.textContent = country.name;
                    countrySelect.appendChild(option);
                });
            } else {
                console.error('Dados de países não encontrados ou em formato inesperado.');
                alert('Não foi possível carregar os países.');
            }
        } catch (error) {
            console.error('Erro ao carregar países:', error);
            alert('Erro ao carregar países. Tente novamente mais tarde.');
        }
    }

    async function loadStates(countryName) {
        stateSelect.innerHTML = '<option value="">Carregando estados...</option>';
        stateSelect.disabled = true;
        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ country: countryName })
            });

            const data = await response.json();

            if (data && data.data && data.data.states) {
                stateSelect.innerHTML = '<option value="">Selecione um estado</option>';
                if (data.data.states.length > 0) {
                    data.data.states.forEach(state => {
                        const option = document.createElement('option');
                        option.value = state.name;
                        option.textContent = state.name;
                        stateSelect.appendChild(option);
                    });
                    stateSelect.disabled = false;
                } else {
                    stateSelect.innerHTML = '<option value="">Nenhum estado encontrado</option>';
                }
            } else {
                console.warn(`Não foram encontrados estados para ${countryName}.`);
                stateSelect.innerHTML = '<option value="">Nenhum estado encontrado</option>';
            }
        } catch (error) {
            console.error('Erro ao carregar estados:', error);
            alert('Não foi possível carregar os estados. Tente novamente mais tarde.');
            stateSelect.innerHTML = '<option value="">Erro ao carregar estados</option>';
        }
    }

    // --- Event Listeners e Lógicas de Inicialização ---

    // Event Listener para o select de países
    countrySelect.addEventListener('change', function() {
        const selectedCountryName = this.value;
        if (selectedCountryName) {
            loadStates(selectedCountryName);
        } else {
            stateSelect.innerHTML = '<option value="">Selecione um estado</option>';
            stateSelect.disabled = true;
        }
    });

    // Carregar países quando a página é carregada
    loadCountries();

    // Lógica para o campo de IDADE
    idadeInput.addEventListener('keydown', function(event) {
        if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Tab') {
            return;
        }
        if (event.key === '-') {
            event.preventDefault();
        }
    });
    idadeInput.addEventListener('input', function() {
        let valor = parseInt(this.value);
        if (isNaN(valor) || valor < 0) {
            this.value = 0;
        }
    });

    // Lógica para os BOTÕES DE MOTIVO
    motivoButtons.forEach(button => {
        button.addEventListener('click', function() {
            motivoButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            motivoInput.value = this.dataset.value;
            motivoInput.dispatchEvent(new Event('input', { bubbles: true })); // Para validação 'required'
        });
    });

    // Lógica para HABILITAR/DESABILITAR o botão de ENVIAR
    aceiteTermosCheckbox.addEventListener('change', function() {
        botaoEnviar.disabled = !this.checked;
    });

    // --- Lógica de ENVIO DO FORMULÁRIO ---
    formulario.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o envio padrão

        // 1. Coletar todos os dados do formulário
        const dadosFormulario = {
            nome: nomeInput.value,
            idade: idadeInput.value,
            pais: countrySelect.value,    // Usar countrySelect.value
            estado: stateSelect.value,   // Usar stateSelect.value
            motivo: motivoInput.value,
            whatsapp: whatsappInput.value,
            horarios: horariosTextarea.value,
            termosAceitos: aceiteTermosCheckbox.checked
        };

        console.log('Dados a serem enviados:', dadosFormulario); // Para debug

        // 2. Enviar os dados para o seu backend
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosFormulario)
            });

            if (response.ok) {
                alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
                // Resetar o formulário e estado dos elementos
                formulario.reset();
                botaoEnviar.disabled = true;
                aceiteTermosCheckbox.checked = false;
                motivoButtons.forEach(btn => btn.classList.remove('selected'));
                motivoInput.value = '';
                countrySelect.innerHTML = '<option value="">Selecione um país</option>'; // Recarregar países
                stateSelect.innerHTML = '<option value="">Selecione um estado</option>';
                stateSelect.disabled = true;
                loadCountries(); // Recarregar a lista de países após o reset
            } else {
                const errorData = await response.text();
                alert('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente. Detalhes: ' + errorData);
            }
        } catch (error) {
            console.error('Erro na requisição Fetch:', error);
            alert('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
        }
    });
});