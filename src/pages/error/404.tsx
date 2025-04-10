import styles from './index.less';

import img_404 from '@/assets/img/404.svg';

export default function AuthPage () {
  return (
    <div className={styles.AuthPage}>
      <img src={img_404} />
    </div>
  );
};