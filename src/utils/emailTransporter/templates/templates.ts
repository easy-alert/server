import {
  ISendConfirmEmail,
  ISendProofOfReport,
  ISendRecoveryPassword,
  INewCompanyCreated,
  INewBuildingCreated,
  ITicketCreated,
  ITicketFinished,
} from '../types';

export class EmailTemplates {
  confirmEmail({ link, subject, text, companyLogo }: ISendConfirmEmail) {
    return `<div
      style='
        background-size: cover;
        background: #EDEDED;
        padding: 24px;
        '
      >
      <div
        style='
          width: 500px;
            margin: auto;
            background: white;
            border-radius: 32px;
            padding: 24px 0;
        '
      >

        <img
          src="${companyLogo}"
          alt=''
          style='
              margin: 0 auto;
              display: block;
              height: 87px;
          '
        />

        <div
          style='
              width: 328px;
              margin: 0 auto;
          '
        >

          <h3
            style='
                color:#000000;
                margin: 40px 0 16px;
                text-align: center;
            '
          >
            ${subject}
          </h3>

          <p
            style='
                color:#000000;
                text-align: center;
            '
          >
            ${text}
          </p>

        </div>

        <div
          style='
              margin: 24px auto;
              width: 328px;
          '
        >

          <a
            href='${link}'
            target='__blank'
            style='
              max-width: 328px;
              text-align: center;
              cursor: pointer;
              background: #B21D1D;
              border: none;
              color:white;
              display: block;
              width: 100%;
              height: 40px;
              border-radius: 4px;
              text-decoration: none;
              line-height: 40px;
            '
          >
            Confirmar
          </a>

          <p
            style='
                color: #000000;
                text-align: center;
            '
          >
            (Se o botão não funcionar acesse o link abaixo)
          </p>

          <a
            href='${link}'
            style='
              color:#B21D1D;
              width: 328px;
              cursor: pointer;
              margin: 8px 0 0 0;
              word-break: break-all;
            '
          >
            ${link}
          </a>

        </div>

      </div>
      </div>
    `;
  }

  recoveryPassword({ link, subject, text }: ISendRecoveryPassword) {
    return `<div
      style='
        background-size: cover;
        background: #EDEDED;
        padding: 24px;
        '
      >
      <div
        style='
          width: 500px;
            margin: auto;
            background: white;
            border-radius: 32px;
            padding: 24px 0;
        '
      >

        <img
          src="https://larguei.s3.us-west-2.amazonaws.com/logoTextBlack-1669059871498.svg"
          alt=''
          style='
              margin: 0 auto;
              display: block;
              height: 87px;
          '
        />

        <div
          style='
              width: 328px;
              margin: 0 auto;
          '
        >

          <h3
            style='
                color:#000000;
                margin: 40px 0 16px;
                text-align: center;
            '
          >
            ${subject}
          </h3>

          <p
            style='
                color:#000000;
                text-align: center;
            '
          >
            ${text}
          </p>

        </div>

        <div
          style='
              margin: 24px auto;
              width: 328px;
          '
        >

          <a
            href='${link}'
            target='__blank'
            style='
              max-width: 328px;
              text-align: center;
              cursor: pointer;
              background: #B21D1D;
              border: none;
              color:white;
              display: block;
              width: 100%;
              height: 40px;
              border-radius: 4px;
              text-decoration: none;
              line-height: 40px;
            '
          >
            Alterar senha
          </a>

          <p
            style='
                color: #000000;
                text-align: center;
            '
          >
            (Se o botão não funcionar acesse o link abaixo)
          </p>

          <a
            href='${link}'
            style='
              color:#B21D1D;
              width: 328px;
              cursor: pointer;
              margin: 8px 0 0 0;
              word-break: break-all;
            '
          >
            ${link}
          </a>

        </div>

      </div>
      </div>
    `;
  }

  proofOfReport({
    companyLogo,
    subject,
    buildingName,
    resolutionDate,
    cost,
    element,
    categoryName,
    syndicName,
    activity,
    dueDate,
    maintenanceObservation,
    notificationDate,
    responsible,
    source,
    attachments,
  }: ISendProofOfReport) {
    return ` <div style="background-size: cover; background: #ededed; padding: 24px;">
  <div
    style="
      width: 500px;
      margin: auto;
      background: white;
      border-radius: 32px;
      padding: 24px 0;
    "
  >
    <img
      src="${companyLogo}"
      alt=""
      style="margin: 0 auto; display: block; height: 87px;"
    />

    <div style="width: 328px; margin: 0 auto;">
      <h3 style="color: #000000; margin: 40px 0 24px; text-align: center;">
        ${subject}
      </h3>

      <p>
        <strong>Edificação: </strong>
        ${buildingName}
      </p>


      <p>
        <strong>Categoria: </strong>
        ${categoryName}
      </p>

      <p>
        <strong>Elemento: </strong>
        ${element}
      </p>

      <p>
        <strong>Atividade: </strong>
        ${activity}
      </p>

      <p>
        <strong>Responsável: </strong>
        ${responsible}
      </p>

      <p>
        <strong>Fonte: </strong>
        ${source}
      </p>

      <p>
        <strong>Observação da manutenção: </strong>
        ${maintenanceObservation}
      </p>

      <p>
        <strong>Data de notificação: </strong>
        ${notificationDate}
      </p>

      <p>
        <strong>Data de vencimento: </strong>
        ${dueDate}
      </p>

      <p>
        <strong>Data de conclusão: </strong>
        ${resolutionDate}
      </p>

      <p>
        <strong>Responsável de manutenção: </strong>
        ${syndicName}
      </p>

      <p>
        <strong>Custo: </strong>
        ${cost}
      </p>

      <p>
      <strong>Anexos: </strong>
          ${attachments
            ?.map(({ filename, path }) => `<a href="${path}" target="_blank">${filename}</a>`)
            .join(', ')}
      </p>
    </div>
  </div>
</div>`;
  }

  newCompanyCreated({ companyName, subject }: INewCompanyCreated) {
    return `<div
    style='
      background-size: cover;
      background: #EDEDED;
      padding: 24px;
      '
    >
    <div
      style='
        width: 500px;
          margin: auto;
          background: white;
          border-radius: 32px;
          padding: 24px 0;
      '
    >

    <img
        src="https://larguei.s3.us-west-2.amazonaws.com/logoTextBlack-1669059871498.svg"
        alt=''
        style='
            margin: 0 auto;
            display: block;
            height: 87px;
        '
      />

      <div
        style='
            width: 328px;
            margin: 0 auto;
        '
      >

        <h3
          style='
              color:#000000;
              margin: 40px 0 16px;
              text-align: center;
          '
        >
          ${subject}
        </h3>

        <p
          style='
              color:#000000;
              text-align: center;
          '
        >
          A empresa ${companyName} acabou de se registrar na plataforma.
        </p>

      </div>
    </div>
    </div>
    `;
  }

  newBuildingCreated({ companyName, subject, buildingName }: INewBuildingCreated) {
    return `<div
    style='
      background-size: cover;
      background: #EDEDED;
      padding: 24px;
      '
    >
    <div
      style='
        width: 500px;
          margin: auto;
          background: white;
          border-radius: 32px;
          padding: 24px 0;
      '
    >

    <img
        src="https://larguei.s3.us-west-2.amazonaws.com/logoTextBlack-1669059871498.svg"
        alt=''
        style='
            margin: 0 auto;
            display: block;
            height: 87px;
        '
      />

      <div
        style='
            width: 328px;
            margin: 0 auto;
        '
      >

        <h3
          style='
              color:#000000;
              margin: 40px 0 16px;
              text-align: center;
          '
        >
          ${subject}
        </h3>

        <p
          style='
              color:#000000;
              text-align: center;
          '
        >
          A empresa ${companyName} cadastrou a edificação ${buildingName} em  ${new Date().toLocaleDateString()}, às ${new Date()
      .toTimeString()
      .substring(0, 5)}.
        </p>

      </div>
    </div>
    </div>
    `;
  }

  deleteMaintenanceScriptUsed({
    route,
    data,
    buildingName,
  }: {
    route: 'todas manutenções expiradas' | 'uma manutenção vencida';
    data: string[];
    buildingName: string;
  }) {
    return `<div
    style='
      background-size: cover;
      background: #EDEDED;
      padding: 24px;
      '
    >
    <div
      style='
        width: 500px;
          margin: auto;
          background: white;
          border-radius: 32px;
          padding: 24px;
      '
    >
        <p
          style='
              color:#000000;
              text-align: center;
          '
        >
         Alguém da Easy Alert usou a rota de deletar ${route} na edificação ${buildingName}:
        </p>

        <p
          style='
              color:#000000;
              text-align: center;
          '
        >
       maintenanceHistoryIds afetados: ${data.join(', ')}
        </p>



    </div>
    </div>
    `;
  }

  ticketCreated({ buildingName, ticketNumber, residentName }: ITicketCreated) {
    return `<div
      style='
        background-size: cover;
        background: #EDEDED;
        padding: 24px;
        '
      >
      <div
        style='
          width: 500px;
            margin: auto;
            background: white;
            border-radius: 32px;
            padding: 24px 0;
        '
      >

        <img
          src="https://larguei.s3.us-west-2.amazonaws.com/logoTextBlack-1669059871498.svg"
          alt=''
          style='
              margin: 0 auto;
              display: block;
              height: 87px;
          '
        />

        <div
          style='
              width: 328px;
              margin: 0 auto;
          '
        >

          <h3
            style='
                color:#000000;
                margin: 40px 0 16px;
                text-align: center;
                font-weight: 400;
            '
          >
          Chamado aberto com sucesso!
          </h3>

          <img
          src="https://larguei.s3.us-west-2.amazonaws.com/siren-1712858703294.png"
          alt=''
          style='
              margin: 0 auto;
              height: 64px;
              display: block;
          '
        />

          <p
            style='
                color:#000000;
                text-align: center;
            '
          >
          Olá, <strong>${residentName}</strong>! Você abriu o chamado <strong>#${ticketNumber}</strong> em <strong>${buildingName}</strong>. Assim que o chamado for finalizado, você será notificado.
          </p>

        </div>
      </div>
      </div>
    `;
  }

  ticketFinished({ ticketNumber, residentName }: ITicketFinished) {
    return `<div
      style='
        background-size: cover;
        background: #EDEDED;
        padding: 24px;
        '
      >
      <div
        style='
          width: 500px;
            margin: auto;
            background: white;
            border-radius: 32px;
            padding: 24px 0;
        '
      >

        <img
          src="https://larguei.s3.us-west-2.amazonaws.com/logoTextBlack-1669059871498.svg"
          alt=''
          style='
              margin: 0 auto;
              display: block;
              height: 87px;
          '
        />

        <div
          style='
              width: 328px;
              margin: 0 auto;
          '
        >

          <h3
            style='
                color:#000000;
                margin: 40px 0 16px;
                text-align: center;
                font-weight: 400;
            '
          >
          Chamado finalizado com sucesso!
          </h3>

          <img
          src="https://larguei.s3.us-west-2.amazonaws.com/check-1712859571711.png"
          alt=''
          style='
              margin: 0 auto;
              height: 64px;
              display: block;
          '
        />

          <p
            style='
                color:#000000;
                text-align: center;
            '
          >
          Olá, <strong>${residentName}</strong>! O chamado <strong>#${ticketNumber}</strong> que você abriu foi finalizado!
          </p>

        </div>
      </div>
      </div>
    `;
  }
}
