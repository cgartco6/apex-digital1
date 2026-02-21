import { useState } from 'react';
import styles from '../styles/PostVariantCreator.module.css';

export default function PostVariantCreator({ variants, setVariants }) {
  const addVariant = () => {
    setVariants([...variants, { content: '', imageUrl: '' }]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      {variants.map((v, i) => (
        <div key={i} className={styles.variant}>
          <h4>Variant {i+1}</h4>
          <textarea placeholder="Content" value={v.content} onChange={e => updateVariant(i, 'content', e.target.value)} />
          <input placeholder="Image URL" value={v.imageUrl} onChange={e => updateVariant(i, 'imageUrl', e.target.value)} />
          {variants.length > 1 && <button onClick={() => removeVariant(i)}>Remove</button>}
        </div>
      ))}
      <button onClick={addVariant}>Add Variant</button>
    </div>
  );
    }
