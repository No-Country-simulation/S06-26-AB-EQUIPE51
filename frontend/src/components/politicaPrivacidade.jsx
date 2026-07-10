import styles from "../styles/politicaPrivacidade.module.css"

export default function PoliticaPrivacidade({ aberto, onFechar }) {
  if (!aberto) return null

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>

        <div className={styles.header}>
          <h3 className={styles.titulo}>Política de Privacidade</h3>
          <button className={styles.fechar} onClick={onFechar}>✕</button>
        </div>

        <div className={styles.corpo}>
          <p className={styles.data}>Última atualização: Junho de 2026</p>
          <p>A App BiT valoriza a privacidade e a proteção dos dados pessoais de seus usuários. Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos as informações fornecidas por empresas e usuários da plataforma.</p>

          <h4>1. Dados Coletados</h4>
          <p>Podemos coletar as seguintes informações:</p>
          <ul>
            <li>Nome da empresa</li>
            <li>Nome dos responsáveis pelo recrutamento</li>
            <li>Endereço de e-mail corporativo</li>
            <li>Informações sobre vagas publicadas</li>
            <li>Dados de perfil profissional dos candidatos</li>
            <li>Informações de localização geográfica fornecidas ou derivadas dos datasets utilizados pela plataforma</li>
            <li>Dados de uso da plataforma</li>
          </ul>

          <h4>2. Finalidade do Tratamento</h4>
          <p>Os dados coletados são utilizados para:</p>
          <ul>
            <li>Permitir o funcionamento da plataforma;</li>
            <li>Realizar matching entre vagas e candidatos;</li>
            <li>Gerar métricas e relatórios relacionados à diversidade e metas ESG;</li>
            <li>Melhorar a experiência dos usuários;</li>
            <li>Produzir análises estatísticas e indicadores agregados;</li>
            <li>Garantir a segurança da plataforma.</li>
          </ul>

          <h4>3. Uso de Inteligência Artificial</h4>
          <p>A plataforma utiliza algoritmos de análise e recomendação para gerar scores de compatibilidade entre candidatos e vagas. As recomendações geradas possuem caráter auxiliar e não substituem a avaliação humana realizada pela empresa contratante.</p>

          <h4>4. Compartilhamento de Dados</h4>
          <p>Não comercializamos dados pessoais. As informações poderão ser compartilhadas apenas quando necessário para:</p>
          <ul>
            <li>Prestação dos serviços da plataforma;</li>
            <li>Cumprimento de obrigações legais;</li>
            <li>Proteção da segurança dos usuários e da plataforma.</li>
          </ul>

          <h4>5. Segurança</h4>
          <p>Adotamos medidas técnicas e organizacionais para proteger os dados armazenados, incluindo:</p>
          <ul>
            <li>Autenticação de usuários;</li>
            <li>Criptografia de senhas;</li>
            <li>Controle de acesso;</li>
            <li>Monitoramento de atividades suspeitas.</li>
          </ul>

          <h4>6. Retenção dos Dados</h4>
          <p>Os dados serão mantidos apenas pelo período necessário para a execução dos serviços e cumprimento de obrigações legais.</p>

          <h4>7. Direitos dos Usuários</h4>
          <p>Os usuários podem solicitar:</p>
          <ul>
            <li>Acesso aos seus dados;</li>
            <li>Correção de informações incorretas;</li>
            <li>Exclusão de informações quando aplicável;</li>
            <li>Revogação do consentimento para tratamento dos dados.</li>
          </ul>

          <h4>8. Alterações</h4>
          <p>Esta Política poderá ser atualizada periodicamente para refletir melhorias na plataforma ou alterações regulatórias.</p>
        </div>

      </div>
    </div>
  )
}