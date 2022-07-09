import {
  Icon20BombOutline,
  Icon20ExclamationMarkOutline,
  Icon20KeyOutline,
  Icon20RoubleOutline
} from '@vkontakte/icons';
import { mail } from '../../interface/mail';

import styles from './additionalIcons.module.css';

const AdditionalIcons = ({ mail }: { mail: mail.Mail }) => {
  return (
    <div className={styles['additional-icon']}>
      {mail.important && (
        <div className={styles['additional-icon--important']}>
          <Icon20ExclamationMarkOutline />
        </div>
      )}
      {mail.finance && (
        <div className={styles['additional-icon--finance']}>
          <Icon20RoubleOutline />
        </div>
      )}
      {mail.confidence && (
        <div className={styles['additional-icon--confidence']}>
          <Icon20KeyOutline />
        </div>
      )}
      {mail.newThread && (
        <div className={styles['additional-icon--new']}>
          <Icon20BombOutline />
        </div>
      )}
    </div>
  );
};

export default AdditionalIcons;
