import { Icon20ExclamationMarkOutline, Icon20KeyOutline, Icon20RoubleOutline } from '@vkontakte/icons';
import { mail } from '../../interface/mail';

import styles from './additionalIcons.module.css';

const AdditionalIcons = ({ mail }: { mail: mail.Mail }) => {
  return (
    <div className={styles['additional-icon']}>
      {mail.newThread && <div className={styles['additional-icon--new']}>new</div>}
      {mail.important && (
        <div className={styles['additional-icon--important']}>
          <Icon20ExclamationMarkOutline />
        </div>
      )}
      {mail.confidence && (
        <div className={styles['additional-icon--confidence']}>
          <Icon20KeyOutline />
        </div>
      )}
      {mail.finance && (
        <div className={styles['additional-icon--finance']}>
          <Icon20RoubleOutline />
        </div>
      )}
    </div>
  );
};

export default AdditionalIcons;
