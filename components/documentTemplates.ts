// models/documentTemplates.ts
export interface StyleOptions {
    fontFamily: string;
    fontSize: string;
    isTitleBold: boolean;
    isTitleUnderlined: boolean;
    showSignatureLine: boolean;
    border: string;
    pattern: string;
}

type FormData = { [key: string]: string };

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
}

export interface TemplateDefinition {
  name: string;
  fields: TemplateField[];
  generator: (data: FormData, options: StyleOptions) => string;
}

const personalInfoFields: TemplateField[] = [
    { id: 'filiacao', label: 'Filiação (Pai e Mãe)', type: 'text', placeholder: 'Nome do Pai e Nome da Mãe' },
    { id: 'naturalidade', label: 'Naturalidade (Local de Nascimento)', type: 'text', placeholder: 'Município, Província' },
    { id: 'nacionalidade', label: 'Nacionalidade', type: 'text', placeholder: 'Angolana' },
    { id: 'bi_emissao', label: 'Data de Emissão do B.I.', type: 'text', placeholder: 'DD/MM/AAAA' },
    { id: 'bi_validade', label: 'Data de Validade do B.I.', type: 'text', placeholder: 'DD/MM/AAAA' },
    { id: 'bi_local', label: 'Local de Emissão do B.I.', type: 'text', placeholder: 'Luanda' },
];

// Helper to create the additional personal info string
const createPersonalInfoString = (data: FormData): string => {
    const parts: string[] = [];
    if (data.filiacao) parts.push(`filho(a) de ${sanitizeAndFormatHtml(data.filiacao)}`);
    if (data.naturalidade) parts.push(`natural de ${sanitizeAndFormatHtml(data.naturalidade)}`);
    if (data.nacionalidade) parts.push(`de nacionalidade ${sanitizeAndFormatHtml(data.nacionalidade)}`);
    if (data.bi_emissao && data.bi_validade && data.bi_local) {
        parts.push(`emitido aos ${sanitizeAndFormatHtml(data.bi_emissao)} em ${sanitizeAndFormatHtml(data.bi_local)}, válido até ${sanitizeAndFormatHtml(data.bi_validade)}`);
    }
    return parts.length > 0 ? `, ${parts.join(', ')}` : '';
};


const sanitizeAndFormatHtml = (unsafe: string): string => {
    if (!unsafe) return '';
    let safe = unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const allowedTags = ['b', 'i', 'u'];
    allowedTags.forEach(tag => {
        const openTagRegex = new RegExp(`&lt;${tag}&gt;`, 'g');
        const closeTagRegex = new RegExp(`&lt;/${tag}&gt;`, 'g');
        safe = safe.replace(openTagRegex, `<${tag}>`).replace(closeTagRegex, `</${tag}>`);
    });
    
    return safe.replace(/\n/g, '<br/>');
};

const getTitleStyle = (options: StyleOptions) => {
    let style = 'text-align: center; margin-bottom: 2em;';
    if (options.isTitleUnderlined) {
        style += 'text-decoration: underline;';
    }
    if (options.isTitleBold) {
        style += 'font-weight: bold;';
    }
    return style;
};

const getSignatureBlock = (options: StyleOptions, signatureText: string) => {
    if (!options.showSignatureLine) return '';
    return `
        <div style="margin-top: 5em; text-align: center;">
            <p style="margin-bottom: 0;">_________________________</p>
            <p style="margin-top: 0.5em;">( ${sanitizeAndFormatHtml(signatureText)} )</p>
        </div>
    `;
};

export const templates: { [key: string]: TemplateDefinition } = {
    pedido: {
        name: 'Carta de Pedido (Alambamento / Dotes)',
        fields: [
            { id: 'familia_noiva', label: 'Nome da Família da Noiva', type: 'text' },
            { id: 'familia_noivo', label: 'Nome da Família do Noivo', type: 'text' },
            { id: 'nome_noiva', label: 'Nome da Noiva', type: 'text' },
            { id: 'nome_noivo', label: 'Nome do Noivo', type: 'text' },
            { id: 'lista_dotes', label: 'Lista de Dotes', type: 'textarea', placeholder: 'Um item por linha. Ex:\n- Um fato completo para o pai\n- Um pano para a mãe\n- Uma caixa de vinho' },
            { id: 'date', label: 'Local e Data', type: 'text', placeholder: 'Luanda, aos...' }
        ],
        generator: (data, options) => {
            const dotesList = (data.lista_dotes || '')
                .split('\n')
                .filter(item => item.trim() !== '')
                .map(item => `<li style="margin-bottom: 0.5em;">${sanitizeAndFormatHtml(item.trim())}</li>`)
                .join('');

            return `
                <h1 style="${getTitleStyle(options)}">CARTA DE PEDIDO</h1>
                <p>À família do noivo, <strong>${sanitizeAndFormatHtml(data.familia_noivo || '____________________')}</strong>,</p>
                <p style="margin-top: 2em;">A família da noiva, <strong>${sanitizeAndFormatHtml(data.familia_noiva || '____________________')}</strong>, vem por este meio, com muito respeito e alegria, apresentar a lista de dotes para a celebração da união entre o noivo <strong>${sanitizeAndFormatHtml(data.nome_noivo || '____________________')}</strong> e a nossa querida noiva <strong>${sanitizeAndFormatHtml(data.nome_noiva || '____________________')}</strong>.</p>
                <h2 style="text-align: center; font-weight: bold; margin-top: 2.5em; margin-bottom: 1.5em;">LISTA DE DOTES</h2>
                <ul style="list-style-type: disc; padding-left: 40px;">
                    ${dotesList || '<li>A lista de dotes será apresentada aqui.</li>'}
                </ul>
                <p style="margin-top: 2.5em;">Aguardamos com expectativa a vossa consideração e a celebração deste momento de união entre as nossas famílias.</p>
                <p style="margin-top: 2em;">Com os nossos melhores cumprimentos,</p>
                <p style="margin-top: 3em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
                ${getSignatureBlock(options, `A Família ${sanitizeAndFormatHtml(data.familia_noiva || 'da Noiva')}`)}
            `;
        }
    },
    amor_alambamento: {
        name: 'Declaração de Amor (Alambamento)',
        fields: [
            { id: 'declarer_name', label: 'Seu Nome Completo', type: 'text' },
            { id: 'partner_name', label: 'Nome do(a) seu(sua) Noivo(a)', type: 'text' },
            { id: 'body', label: 'A sua Declaração', type: 'textarea', placeholder: 'Escreva com o coração. Fale sobre como se conheceram, o que admira na pessoa, os seus sonhos para o futuro e a sua promessa de amor e respeito...' },
            { id: 'date', label: 'Local e Data', type: 'text' }
        ],
        generator: (data, options) => `
            <h1 style="${getTitleStyle(options)}; font-family: 'Dancing Script', cursive; font-size: 2.5em;">Declaração de Amor</h1>
            <p>Perante as nossas respeitadas famílias e amigos aqui reunidos, eu, <strong>${sanitizeAndFormatHtml(data.declarer_name || '____________________')}</strong>, desejo abrir o meu coração e expressar o meu profundo amor por <strong>${sanitizeAndFormatHtml(data.partner_name || '____________________')}</strong>.</p>
            <p style="text-align: justify; text-indent: 2em; margin-top: 1.5em;">${sanitizeAndFormatHtml(data.body || 'Desde o momento em que te conheci, a minha vida ganhou uma nova cor, uma nova melodia. Admiro a tua força, a tua bondade e a forma como me fazes sentir a pessoa mais especial do mundo. Hoje, ao darmos este passo tão importante do alambamento, reafirmo a minha intenção de construir um futuro ao teu lado, baseado no respeito, na cumplicidade e num amor que cresce a cada dia.')}</p>
            <p>Prometo honrar-te, respeitar-te e amar-te, hoje e por todos os dias da nossa vida juntos.</p>
            <p style="margin-top: 3em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            ${getSignatureBlock(options, sanitizeAndFormatHtml(data.declarer_name || 'Seu Nome'))}
        `
    },
    amor_casamento: {
        name: 'Votos de Casamento',
        fields: [
            { id: 'partner_name', label: 'Nome do(a) seu(sua) Parceiro(a)', type: 'text' },
            { id: 'body', label: 'Os seus Votos', type: 'textarea', placeholder: 'Escreva as suas promessas, as razões pelas quais ama a pessoa e os seus desejos para a vossa vida em conjunto...' },
            { id: 'declarer_name', label: 'Seu Nome (para o final)', type: 'text' }
        ],
        generator: (data, options) => `
            <div style="text-align: center;">
                 <h1 style="${getTitleStyle(options)}; font-family: 'Dancing Script', cursive; font-size: 2.5em;">Meus Votos para Ti</h1>
                 <p style="font-size: 1.5em; margin-bottom: 2em;">${sanitizeAndFormatHtml(data.partner_name || 'Meu Amor')},</p>
            </div>
            <p style="text-align: justify; text-indent: 2em;">${sanitizeAndFormatHtml(data.body || 'Hoje, diante de todos que amamos, eu prometo ser o teu porto seguro, o teu maior fã e o teu companheiro fiel em todas as aventuras que a vida nos reservar. Prometo rir contigo nos momentos de alegria e apoiar-te nos desafios. Amo-te pelo que és e por tudo o que ainda seremos juntos.')}</p>
            <p style="margin-top: 2em; text-align: right;">Com todo o meu amor,</p>
            <p style="text-align: right; font-weight: bold;">${sanitizeAndFormatHtml(data.declarer_name || '____________________')}</p>
        `
    },
    biografia: {
        name: 'Biografia',
        fields: [
            { id: 'fullName', label: 'Nome Completo (da pessoa biografada)', type: 'text' },
            { id: 'birthDate', label: 'Data de Nascimento e Local', type: 'text', placeholder: 'Ex: 15 de Janeiro de 1950, em Luanda' },
            { id: 'keyAchievements', label: 'Principais Feitos e Conquistas', type: 'textarea', placeholder: 'Descreva a sua carreira, marcos importantes, contribuições para a comunidade, etc.' },
            { id: 'personalQualities', label: 'Qualidades Pessoais e Legado', type: 'textarea', placeholder: 'Fale sobre o seu carácter, paixões, e o impacto que teve nas pessoas.' },
            { id: 'authorName', label: 'Nome do Autor (Opcional)', type: 'text' }
        ],
        generator: (data, options) => `
            <h1 style="${getTitleStyle(options)}">BIOGRAFIA DE ${sanitizeAndFormatHtml(data.fullName || '____________________')}</h1>
            <p><strong>${sanitizeAndFormatHtml(data.fullName || '____________________')}</strong>, nascido(a) a ${sanitizeAndFormatHtml(data.birthDate || '___ de ___________ de ______')}, foi uma figura de notável importância e carácter.</p>
            <h2 style="font-weight: bold; margin-top: 2em; margin-bottom: 1em;">Percurso e Conquistas</h2>
            <p>${sanitizeAndFormatHtml(data.keyAchievements || 'A sua trajetória foi marcada por inúmeros feitos. ...')}</p>
            <h2 style="font-weight: bold; margin-top: 2em; margin-bottom: 1em;">Legado e Memória</h2>
            <p>${sanitizeAndFormatHtml(data.personalQualities || 'Será sempre recordado(a) pela sua generosidade, sabedoria e pelo impacto positivo que deixou em todos os que o(a) conheceram.')}</p>
            ${data.authorName ? `<p style="text-align: right; margin-top: 3em;"><em>Biografia escrita por ${sanitizeAndFormatHtml(data.authorName)}.</em></p>` : ''}
        `
    },
    elogio_funebre: {
        name: 'Elogio Fúnebre',
        fields: [
            { id: 'deceasedName', label: 'Nome do Falecido(a)', type: 'text' },
            { id: 'relationship', label: 'Sua Relação com o Falecido(a)', type: 'text', placeholder: 'Ex: amigo, filho, colega...' },
            { id: 'body', label: 'Mensagem e Memórias', type: 'textarea', placeholder: 'Partilhe uma memória especial, fale sobre as qualidades da pessoa e o que ela significava para si e para os outros...' },
            { id: 'closing', label: 'Frase de Encerramento', type: 'text', placeholder: 'Ex: Descansa em paz, querido(a) amigo(a).' },
            { id: 'speakerName', label: 'Seu Nome', type: 'text' }
        ],
        generator: (data, options) => `
            <h1 style="${getTitleStyle(options)}">Em Memória de ${sanitizeAndFormatHtml(data.deceasedName || '____________________')}</h1>
            <p>Hoje, reunimo-nos com o coração pesado para nos despedirmos de <strong>${sanitizeAndFormatHtml(data.deceasedName || '____________________')}</strong>, que para mim foi um(a) querido(a) ${sanitizeAndFormatHtml(data.relationship || 'ente querido')}.</p>
            <p style="text-align: justify; text-indent: 2em; margin-top: 1.5em;">${sanitizeAndFormatHtml(data.body || 'Recordo-me de [uma memória especial]... Era uma pessoa [descrever qualidades como generosidade, alegria, força...]. O seu legado viverá para sempre nos nossos corações e nas vidas que tocou.')}</p>
            <p style="text-align: center; font-style: italic; margin-top: 2em;">${sanitizeAndFormatHtml(data.closing || 'Que a sua alma descanse em paz.')}</p>
            <p style="margin-top: 3em; text-align: right;">Com eterna saudade,</p>
            ${getSignatureBlock(options, sanitizeAndFormatHtml(data.speakerName || 'Seu Nome'))}
        `
    },
    rec: {
        name: 'Carta de Recomendação',
        fields: [
            { id: 'recommender', label: 'Nome do Recomendador', type: 'text' },
            { id: 'position', label: 'Cargo do Recomendador', type: 'text' },
            { id: 'recommended_person', label: 'Nome da Pessoa Recomendada', type: 'text' },
            { id: 'body', label: 'Corpo da Carta', type: 'textarea', placeholder: 'Descreva a sua relação com a pessoa e as suas qualidades...' },
            { id: 'date', label: 'Local e Data', type: 'text', placeholder: 'Luanda, aos...' }
        ],
        generator: (data, options) => `
            <h1 style="${getTitleStyle(options)}">CARTA DE RECOMENDAÇÃO</h1>
            <p>A quem possa interessar,</p>
            <p>Eu, <strong>${sanitizeAndFormatHtml(data.recommender || '____________________')}</strong>, na qualidade de <strong>${sanitizeAndFormatHtml(data.position || '____________________')}</strong>, venho por este meio recomendar os serviços profissionais de <strong>${sanitizeAndFormatHtml(data.recommended_person || '____________________')}</strong>.</p>
            <p>${sanitizeAndFormatHtml(data.body || 'Durante o período em que trabalhámos juntos, [Nome] demonstrou ser um(a) profissional de excelência, com notáveis competências e uma atitude proativa. O seu desempenho foi fundamental para o sucesso de vários projetos.')}</p>
            <p>Não hesito em recomendar <strong>${sanitizeAndFormatHtml(data.recommended_person || '____________________')}</strong> para qualquer função que exija responsabilidade e dedicação.</p>
            <p style="margin-top: 3em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            <p style="margin-top: 2em;">Com os melhores cumprimentos,</p>
            ${getSignatureBlock(options, `${sanitizeAndFormatHtml(data.recommender || 'Nome do Recomendador')}<br/>${sanitizeAndFormatHtml(data.position || 'Cargo')}`)}
        `
    },
    servico: {
        name: 'Declaração de Serviço',
        fields: [
            { id: 'company_name', label: 'Nome da Empresa', type: 'text' },
            { id: 'employee_name', label: 'Nome do Colaborador', type: 'text' },
            { id: 'id_card', label: 'Nº do Bilhete de Identidade', type: 'text' },
            { id: 'start_date', label: 'Data de Início', type: 'text', placeholder: 'DD/MM/AAAA' },
            { id: 'end_date', label: 'Data de Fim (Opcional)', type: 'text', placeholder: 'DD/MM/AAAA' },
            { id: 'role', label: 'Função Desempenhada', type: 'text' },
            { id: 'date', label: 'Local e Data', type: 'text', placeholder: 'Luanda, aos...' }
        ],
        generator: (data, options) => `
            <h1 style="${getTitleStyle(options)}">DECLARAÇÃO DE SERVIÇO</h1>
            <p>Para os devidos efeitos, a empresa <strong>${sanitizeAndFormatHtml(data.company_name || '____________________')}</strong> declara que o(a) Sr(a). <strong>${sanitizeAndFormatHtml(data.employee_name || '____________________')}</strong>, portador(a) do Bilhete de Identidade nº <strong>${sanitizeAndFormatHtml(data.id_card || '____________________')}</strong>, faz parte do seu quadro de pessoal desde <strong>${sanitizeAndFormatHtml(data.start_date || '__/__/____')}</strong>${data.end_date ? ` até <strong>${sanitizeAndFormatHtml(data.end_date)}</strong>` : ''}.</p>
            <p>Durante este período, o(a) referido(a) colaborador(a) exerce a função de <strong>${sanitizeAndFormatHtml(data.role || '____________________')}</strong> com zelo, dedicação e profissionalismo.</p>
            <p style="margin-top: 2em;">A presente declaração é emitida para os fins que o(a) interessado(a) julgar convenientes.</p>
            <p style="margin-top: 3em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            ${getSignatureBlock(options, `A Gerência<br/>( ${sanitizeAndFormatHtml(data.company_name || 'Nome da Empresa')} )`)}
        `
    },
    motivacao: {
        name: 'Carta de Motivação',
        fields: [
            { id: 'sender_name', label: 'Seu Nome', type: 'text' },
            { id: 'recipient_name', label: 'Nome do Destinatário', type: 'text' },
            { id: 'company_name', label: 'Nome da Empresa', type: 'text' },
            { id: 'role', label: 'Vaga a que se candidata', type: 'text' },
            { id: 'body', label: 'Corpo da Carta', type: 'textarea' },
            { id: 'date', label: 'Local e Data', type: 'text' }
        ],
        generator: (data, options) => `
            <div style="text-align: right;">
                <p style="margin: 0;"><strong>${sanitizeAndFormatHtml(data.sender_name || 'Seu Nome')}</strong></p>
                <p style="margin: 0;">[Sua Morada]</p>
                <p style="margin: 0;">[Seu Contacto]</p>
            </div>
            <div style="margin-top: 2em;">
                <p style="margin: 0;">Exmo(a). Sr(a). <strong>${sanitizeAndFormatHtml(data.recipient_name || '____________________')}</strong></p>
                <p style="margin: 0;"><strong>${sanitizeAndFormatHtml(data.company_name || 'Nome da Empresa')}</strong></p>
            </div>
            <p style="margin-top: 2em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            <h2 style="font-weight: bold; margin-top: 2em;">Assunto: Candidatura à vaga de ${sanitizeAndFormatHtml(data.role || '____________________')}</h2>
            <p>Exmo(a). Senhor(a),</p>
            <p>Escrevo para expressar o meu profundo interesse na vaga de <strong>${sanitizeAndFormatHtml(data.role || '____________________')}</strong>. Acredito que a minha formação e experiência são uma excelente combinação para as exigências da função e para os objetivos da vossa empresa.</p>
            <p>${sanitizeAndFormatHtml(data.body || 'A [Nome da Empresa] é uma referência no setor, e a vossa abordagem inovadora alinha-se com os meus objetivos de carreira. Estou entusiasmado(a) com a oportunidade de aplicar as minhas competências para ajudar a vossa empresa a crescer.')}</p>
            <p>Agradeço a vossa atenção e coloco-me à disposição para uma entrevista.</p>
            <p style="margin-top: 2em;">Com os melhores cumprimentos,</p>
            ${getSignatureBlock(options, sanitizeAndFormatHtml(data.sender_name || 'Seu Nome'))}
        `
    },
    requerimento: {
        name: 'Requerimento',
        fields: [
            { id: 'recipient_name', label: 'Nome do Destinatário', type: 'text' },
            { id: 'subject', label: 'Assunto do Requerimento', type: 'text' },
            { id: 'requester_name', label: 'Nome do Requerente', type: 'text' },
            { id: 'id_card', label: 'Nº do Bilhete de Identidade', type: 'text' },
            ...personalInfoFields,
            { id: 'body', label: 'Pedido', type: 'textarea' },
            { id: 'date', label: 'Local e Data', type: 'text' }
        ],
        generator: (data, options) => `
            <p>Exmo(a). Senhor(a) <strong>${sanitizeAndFormatHtml(data.recipient_name || '____________________')}</strong></p>
            <p>[Cargo e Entidade do Destinatário]</p>
            <h2 style="font-weight: bold; margin-top: 2em;">Assunto: Requerimento - ${sanitizeAndFormatHtml(data.subject || '____________________')}</h2>
            <p>Eu, <strong>${sanitizeAndFormatHtml(data.requester_name || '____________________')}</strong>, portador(a) do Bilhete de Identidade nº <strong>${sanitizeAndFormatHtml(data.id_card || '____________________')}</strong>${createPersonalInfoString(data)}, venho por este meio requerer a V. Exa. que se digne autorizar o seguinte:</p>
            <p style="margin-top: 1.5em; margin-bottom: 1.5em;">${sanitizeAndFormatHtml(data.body || '______________________________________________________________________')}</p>
            <p>Pelo exposto, peço deferimento.</p>
            <p style="margin-top: 3em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            ${getSignatureBlock(options, sanitizeAndFormatHtml(data.requester_name || 'Nome do Requerente'))}
        `
    },
    resposta: {
        name: 'Carta de Resposta',
        fields: [
            { id: 'sender_entity', label: 'Sua Entidade/Empresa', type: 'text' },
            { id: 'recipient_name', label: 'Nome do Destinatário', type: 'text' },
            { id: 'reference', label: 'Referência da Carta Original', type: 'text', placeholder: 'Ex: V/ Carta de DD/MM/AAAA' },
            { id: 'body', label: 'Corpo da Resposta', type: 'textarea' },
            { id: 'sender_name', label: 'Nome do Remetente (Assinatura)', type: 'text' },
            { id: 'date', label: 'Local e Data', type: 'text' }
        ],
        generator: (data, options) => `
            <div style="text-align: right; margin-bottom: 2em;">
                <p style="margin: 0;"><strong>${sanitizeAndFormatHtml(data.sender_entity || 'Sua Entidade')}</strong></p>
                <p style="margin: 0;">[Seu Endereço]</p>
            </div>
            <p>Exmo(a). Sr(a).<br/><strong>${sanitizeAndFormatHtml(data.recipient_name || '____________________')}</strong></p>
            <p>[Endereço do Destinatário]</p>
            <p style="margin-top: 2em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            <h2 style="font-weight: bold; margin-top: 2em;">Assunto: Resposta à V/ Comunicação - Ref: ${sanitizeAndFormatHtml(data.reference || '____________________')}</h2>
            <p>Exmo(a). Senhor(a),</p>
            <p>Em resposta à vossa comunicação com a referência em epígrafe, vimos por este meio informar o seguinte:</p>
            <p style="margin: 1.5em 0;">${sanitizeAndFormatHtml(data.body || '______________________________________________________________________')}</p>
            <p>Ficamos à vossa inteira disposição para qualquer esclarecimento adicional.</p>
            <p style="margin-top: 2em;">Com os melhores cumprimentos,</p>
            ${getSignatureBlock(options, `${sanitizeAndFormatHtml(data.sender_name || 'Nome do Remetente')}<br/>${sanitizeAndFormatHtml(data.sender_entity || 'Sua Entidade')}`)}
        `
    },
    residencia: {
        name: 'Declaração de Residência',
        fields: [
            { id: 'declarer_name', label: 'Nome do Declarante', type: 'text' },
            { id: 'id_card', label: 'Nº do Bilhete de Identidade', type: 'text' },
            ...personalInfoFields,
            { id: 'address', label: 'Morada Completa', type: 'text' },
            { id: 'purpose', label: 'Finalidade da Declaração', type: 'text' },
            { id: 'date', label: 'Local e Data', type: 'text' }
        ],
        generator: (data, options) => `
            <h1 style="${getTitleStyle(options)}">DECLARAÇÃO DE RESIDÊNCIA</h1>
            <p>Para os devidos efeitos, eu, <strong>${sanitizeAndFormatHtml(data.declarer_name || '____________________')}</strong>, portador(a) do Bilhete de Identidade nº <strong>${sanitizeAndFormatHtml(data.id_card || '____________________')}</strong>${createPersonalInfoString(data)}, declaro por minha honra que resido na seguinte morada:</p>
            <p style="text-align: center; font-weight: bold; margin: 2em 0;">${sanitizeAndFormatHtml(data.address || '__________________________________________________')}</p>
            <p>A presente declaração é emitida para fins de <strong>${sanitizeAndFormatHtml(data.purpose || '____________________')}</strong>.</p>
            <p style="margin-top: 2em;">Por ser verdade e me ter sido solicitada, passo a presente declaração que vai por mim assinada.</p>
            <p style="margin-top: 3em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            ${getSignatureBlock(options, sanitizeAndFormatHtml(data.declarer_name || 'Nome Completo'))}
        `
    },
     recibo: {
        name: 'Recibo',
        fields: [
            { id: 'value_num', label: 'Valor (em Kz)', type: 'text' },
            { id: 'payer_name', label: 'Nome de Quem Pagou', type: 'text' },
            { id: 'value_ext', label: 'Valor por Extenso', type: 'text' },
            { id: 'referent', label: 'Referente a', type: 'text' },
            { id: 'receiver_name', label: 'Nome de Quem Recebeu', type: 'text' },
            { id: 'date', label: 'Local e Data', type: 'text' }
        ],
        generator: (data, options) => `
            <div style="border: 1px solid #333; padding: 2em;">
                <h1 style="${getTitleStyle(options)}">RECIBO</h1>
                <p style="text-align: right; font-weight: bold;">Valor: ${sanitizeAndFormatHtml(data.value_num || '___________')} Kz</p>
                <p style="margin-top: 2em;">Recebi de <strong>${sanitizeAndFormatHtml(data.payer_name || '____________________')}</strong> a quantia de <strong>${sanitizeAndFormatHtml(data.value_ext || '____________________')}</strong>, referente a <strong>${sanitizeAndFormatHtml(data.referent || '____________________')}</strong>.</p>
                <p style="margin-top: 2em;">Por ser verdade, passo o presente recibo.</p>
                <p style="margin-top: 3em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
                ${getSignatureBlock(options, sanitizeAndFormatHtml(data.receiver_name || 'Nome de Quem Recebeu'))}
            </div>
        `
    },
    procuracao: {
        name: 'Procuração',
        fields: [
            { id: 'mandator_name', label: 'Nome do Outorgante (Quem passa a procuração)', type: 'text' },
            { id: 'mandator_id', label: 'B.I. do Outorgante', type: 'text' },
            ...personalInfoFields,
            { id: 'proxy_name', label: 'Nome do Procurador (Quem recebe os poderes)', type: 'text' },
            { id: 'proxy_id', label: 'B.I. do Procurador', type: 'text' },
            { id: 'powers', label: 'Poderes Concedidos', type: 'textarea' },
            { id: 'date', label: 'Local e Data', type: 'text' }
        ],
        generator: (data, options) => `
            <h1 style="${getTitleStyle(options)}">PROCURAÇÃO</h1>
            <p>Pelo presente instrumento, eu, <strong>${sanitizeAndFormatHtml(data.mandator_name || '____________________')}</strong>, portador(a) do B.I. nº <strong>${sanitizeAndFormatHtml(data.mandator_id || '____________________')}</strong>${createPersonalInfoString(data)}, nomeio como meu(minha) bastante procurador(a) o(a) Sr(a). <strong>${sanitizeAndFormatHtml(data.proxy_name || '____________________')}</strong>, portador(a) do B.I. nº <strong>${sanitizeAndFormatHtml(data.proxy_id || '____________________')}</strong>.</p>
            <p style="margin-top: 1.5em;">Concedo ao(à) meu(minha) procurador(a) os poderes para tratar dos seguintes assuntos:</p>
            <p style="font-weight: bold; margin: 1em 0;">${sanitizeAndFormatHtml(data.powers || '__________________________________________________')}</p>
            <p>O(A) meu(minha) procurador(a) poderá praticar todos os atos necessários ao bom e fiel cumprimento deste mandato.</p>
            <p style="margin-top: 3em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            ${getSignatureBlock(options, sanitizeAndFormatHtml(data.mandator_name || 'Nome do Outorgante'))}
        `
    },
    termo_resp: {
        name: 'Termo de Responsabilidade',
        fields: [
            { id: 'declarer_name', label: 'Nome do Declarante', type: 'text' },
            { id: 'declarer_id', label: 'Nº do B.I. do Declarante', type: 'text' },
            ...personalInfoFields,
            { id: 'subject', label: 'Assunto/Objeto da Responsabilidade', type: 'textarea', placeholder: 'Ex: Pela utilização do equipamento X, pela guarda do menor Y...' },
            { id: 'body', label: 'Corpo da Declaração', type: 'textarea', placeholder: 'Ex: Declaro estar ciente dos riscos e isento a entidade X de qualquer dano...' },
            { id: 'date', label: 'Local e Data', type: 'text' }
        ],
        generator: (data, options) => `
            <h1 style="${getTitleStyle(options)}">TERMO DE RESPONSABILIDADE</h1>
            <p style="text-align: justify; text-indent: 2em; margin-top: 2em;">
                Eu, <strong>${sanitizeAndFormatHtml(data.declarer_name || '____________________')}</strong>, portador(a) do Bilhete de Identidade nº <strong>${sanitizeAndFormatHtml(data.declarer_id || '____________________')}</strong>${createPersonalInfoString(data)}, declaro para os devidos efeitos e sob compromisso de honra, assumir a inteira e total responsabilidade pelo seguinte:
            </p>
            <p style="font-weight: bold; text-align: center; margin: 2em 0;">
                ${sanitizeAndFormatHtml(data.subject || '__________________________________________________')}
            </p>
            <p style="text-align: justify; text-indent: 2em;">
                ${sanitizeAndFormatHtml(data.body || 'Declaro ainda estar ciente de todas as condições, normas de utilização e possíveis consequências, isentando [Nome da Entidade/Pessoa], de qualquer responsabilidade futura por danos, perdas ou quaisquer outros encargos que possam advir da minha ação ou negligência.')}
            </p>
            <p style="margin-top: 2em;">
                Este termo é assinado voluntariamente e em sinal de total conformidade.
            </p>
            <p style="margin-top: 3em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            ${getSignatureBlock(options, sanitizeAndFormatHtml(data.declarer_name || 'Nome do Declarante'))}
        `
    },
    comercial: {
        name: 'Carta Comercial',
        fields: [
            { id: 'sender_entity', label: 'Sua Empresa/Entidade', type: 'text' },
            { id: 'recipient_entity', label: 'Empresa/Entidade Destinatária', type: 'text' },
            { id: 'recipient_contact', label: 'Ao Cuidado de (Opcional)', type: 'text' },
            { id: 'subject', label: 'Assunto', type: 'text' },
            { id: 'body', label: 'Corpo da Carta', type: 'textarea', placeholder: 'Exponha o assunto de forma clara e profissional...' },
            { id: 'sender_name', label: 'Seu Nome (para assinatura)', type: 'text' },
            { id: 'sender_role', label: 'Seu Cargo (para assinatura)', type: 'text' },
            { id: 'date', label: 'Local e Data', type: 'text', placeholder: 'Luanda, aos...' }
        ],
        generator: (data, options) => `
            <div style="text-align: right; margin-bottom: 2em;">
                <p style="margin: 0; font-weight: bold;">${sanitizeAndFormatHtml(data.sender_entity || 'Sua Empresa')}</p>
                <p style="margin: 0;">[Seu Endereço]</p>
                <p style="margin: 0;">[Seu Contacto]</p>
            </div>
            <p>À<br/><strong>${sanitizeAndFormatHtml(data.recipient_entity || '____________________')}</strong><br/>
            ${data.recipient_contact ? `A/C: ${sanitizeAndFormatHtml(data.recipient_contact)}<br/>` : ''}
            [Endereço do Destinatário]</p>
            <p style="margin-top: 2em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            <h2 style="font-weight: bold; margin-top: 2em;">Assunto: ${sanitizeAndFormatHtml(data.subject || '____________________')}</h2>
            <p>Exmos. Senhores,</p>
            <p>${sanitizeAndFormatHtml(data.body || '______________________________________________________________________')}</p>
            <p style="margin-top: 2em;">Com os melhores cumprimentos,</p>
            ${getSignatureBlock(options, `${sanitizeAndFormatHtml(data.sender_name || 'Seu Nome')}<br/>${sanitizeAndFormatHtml(data.sender_role || 'Seu Cargo')}`)}
        `
    },
    contrato: {
        name: 'Contrato Simples',
        fields: [
            { id: 'title', label: 'Título do Contrato', type: 'text', placeholder: 'Ex: Contrato de Prestação de Serviços' },
            { id: 'party1_name', label: 'Nome Completo da Parte 1 (Contratante)', type: 'text' },
            { id: 'party1_id', label: 'B.I. da Parte 1', type: 'text' },
            { id: 'party2_name', label: 'Nome Completo da Parte 2 (Contratado)', type: 'text' },
            { id: 'party2_id', label: 'B.I. da Parte 2', type: 'text' },
            { id: 'object', label: 'Objeto do Contrato', type: 'textarea', placeholder: 'Descrever o serviço a ser prestado ou o bem a ser transacionado...' },
            { id: 'clauses', label: 'Cláusulas (preço, prazo, etc.)', type: 'textarea', placeholder: 'Cláusula 1ª: O preço acordado é de X Kz...\nCláusula 2ª: O prazo para execução é de Y dias...' },
            { id: 'date', label: 'Local e Data', type: 'text' }
        ],
        generator: (data, options) => `
            <h1 style="${getTitleStyle(options)}">${sanitizeAndFormatHtml(data.title || 'CONTRATO')}</h1>
            <p>Entre:</p>
            <p><strong>PRIMEIRO OUTORGANTE:</strong> ${sanitizeAndFormatHtml(data.party1_name || '____________________')}, portador(a) do B.I. nº ${sanitizeAndFormatHtml(data.party1_id || '____________________')}, doravante designado(a) por Contratante.</p>
            <p><strong>SEGUNDO OUTORGANTE:</strong> ${sanitizeAndFormatHtml(data.party2_name || '____________________')}, portador(a) do B.I. nº ${sanitizeAndFormatHtml(data.party2_id || '____________________')}, doravante designado(a) por Contratado(a).</p>
            <p>É celebrado o presente contrato, que se rege pelas seguintes cláusulas:</p>
            <h3 style="font-weight: bold; margin-top: 1.5em;">CLÁUSULA PRIMEIRA (Objeto)</h3>
            <p>${sanitizeAndFormatHtml(data.object || '______________________________________________________________________')}</p>
            <h3 style="font-weight: bold; margin-top: 1.5em;">CLÁUSULAS SEGUINTES</h3>
            <p>${sanitizeAndFormatHtml(data.clauses || '______________________________________________________________________')}</p>
            <p style="margin-top: 2em;">Por estarem de acordo, as partes assinam o presente contrato em duplicado.</p>
            <p style="margin-top: 3em;">${sanitizeAndFormatHtml(data.date || 'Luanda, aos ___ de ___________ de ______')}</p>
            <div style="margin-top: 5em; display: flex; justify-content: space-around; text-align: center;">
                <div>
                    <p style="margin-bottom: 0;">_________________________</p>
                    <p style="margin-top: 0.5em;">( ${sanitizeAndFormatHtml(data.party1_name || 'Parte 1')} )</p>
                </div>
                <div>
                    <p style="margin-bottom: 0;">_________________________</p>
                    <p style="margin-top: 0.5em;">( ${sanitizeAndFormatHtml(data.party2_name || 'Parte 2')} )</p>
                </div>
            </div>
        `
    },
    custom: {
        name: 'Documento Personalizado',
        fields: [
            { id: 'custom_content', label: 'Conteúdo do Documento', type: 'textarea', placeholder: 'Escreva o seu texto livremente aqui...' }
        ],
        generator: (data, options) => {
            const content = data.custom_content || 'O seu conteúdo aparecerá aqui.';
            const signatureText = 'A Assinatura'; 
            return `
                <div style="white-space: pre-wrap; text-align: justify;">${sanitizeAndFormatHtml(content)}</div>
                ${getSignatureBlock(options, signatureText)}
            `;
        }
    }
};

export function getDocumentAsHtml(docId: string, data: FormData, options: StyleOptions): string | null {
    const template = templates[docId];
    if (!template) return null;
    
    const content = template.generator(data, options);
    
    // The outer div creates the 1.5cm margin from the paper edge and acts as a flex container
    // to ensure its child can fill the full height.
    const pageStyle = `
        font-family: ${options.fontFamily}; 
        font-size: ${options.fontSize}; 
        line-height: 1.6; 
        color: #333; 
        background: #fff;
        width: 210mm;
        min-height: 297mm;
        padding: 1.5cm; /* This sets the 1.5cm margin from the edge */
        margin: 0 auto;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        box-sizing: border-box;
        display: flex; /* Using flexbox for robust height management */
        flex-direction: column;
    `;

    // The inner div contains the border and the actual content. It grows to fill the
    // available space within the padded parent, solving the "not covering full document" issue.
    const contentWrapperStyle = `
        border: ${options.border};
        flex-grow: 1; /* This makes the div stretch to fill the container's height */
        padding: 1em; /* Add a small, reasonable padding between the border and the text for better readability */
        box-sizing: border-box;
    `;

    return `
        <div style="${pageStyle.replace(/\s+/g, ' ').trim()}">
            <div style="${contentWrapperStyle.replace(/\s+/g, ' ').trim()}">
                ${content}
            </div>
        </div>
    `;
}