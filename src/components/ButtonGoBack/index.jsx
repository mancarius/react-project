/* eslint-disable import/no-anonymous-default-export */
import React from 'react'
import { useHistory } from 'react-router-dom'
import styles from './styles/index.module.css'

export default React.memo(({ children, className, title }) => {
    const history = useHistory();

    const goBack = () => {
        if (history.length > 0)
            history.goBack();
        else
            history.push('/');
    }

    return <button className={className} onClick={goBack} title={title} alt={title}>{children}</button>;
});