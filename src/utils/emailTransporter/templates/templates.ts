import {
  ISendConfirmEmail,
  ISendProofOfReport,
  ISendRecoveryPassword,
  INewCompanyCreated,
  INewBuildingCreated,
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
    reportObservation,
    dueDate,
    maintenanceObservation,
    notificationDate,
    responsible,
    source,
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
        <strong>Observação do relato: </strong>
        ${reportObservation}
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
          A empresa ${companyName} acabou de cadastrar a edificação ${buildingName}.
        </p>

      </div>
    </div>
    </div>
    `;
  }
}
