import Icon from '../Icon.jsx';

// Shared form primitives + validators used by every public form.

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
export const isPhone = (v) => v === '' || /^[+()\-\s\d]{7,20}$/.test(v);
export const required = (v) => String(v || '').trim() !== '';

export function Field({ label, name, type = 'text', value, onChange, error, required, placeholder, autoComplete, span2 }) {
  return (
    <div className={`field ${span2 ? 'span-2' : ''}`}>
      <label htmlFor={name}>
        {label} {required && <span className="req" aria-hidden="true">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={`input ${error ? 'invalid' : ''}`}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
      />
      {error && <p className="f-err" id={`${name}-err`}>{error}</p>}
    </div>
  );
}

export function SelectField({ label, name, value, onChange, options, error, required, span2 }) {
  return (
    <div className={`field ${span2 ? 'span-2' : ''}`}>
      <label htmlFor={name}>
        {label} {required && <span className="req" aria-hidden="true">*</span>}
      </label>
      <select
        id={name}
        name={name}
        className={`input ${error ? 'invalid' : ''}`}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <p className="f-err" id={`${name}-err`}>{error}</p>}
    </div>
  );
}

export function TextArea({ label, name, value, onChange, error, required, rows = 5, placeholder, span2 = true }) {
  return (
    <div className={`field ${span2 ? 'span-2' : ''}`}>
      <label htmlFor={name}>
        {label} {required && <span className="req" aria-hidden="true">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`input ${error ? 'invalid' : ''}`}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
      />
      {error && <p className="f-err" id={`${name}-err`}>{error}</p>}
    </div>
  );
}

export function FileField({ label, name, file, onFile, error, required, accept, hint }) {
  return (
    <div className="field span-2">
      <label htmlFor={name}>
        {label} {required && <span className="req" aria-hidden="true">*</span>}
      </label>
      <div className={`file-box ${error ? 'invalid' : ''}`}>
        <input
          id={name}
          name={name}
          type="file"
          accept={accept}
          onChange={(e) => onFile(e.target.files[0] || null)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-err` : undefined}
        />
        <Icon name="upload" />
        <span className="file-name">{file ? file.name : hint || 'Choose a file'}</span>
      </div>
      {error && <p className="f-err" id={`${name}-err`}>{error}</p>}
    </div>
  );
}

export function PillGroup({ label, name, value, onChange, options, error, span2 = true }) {
  return (
    <fieldset className={`field pill-group ${span2 ? 'span-2' : ''}`}>
      <legend>{label}</legend>
      <div className="pills" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <label className="pill" key={o}>
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={onChange}
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {error && <p className="f-err">{error}</p>}
    </fieldset>
  );
}

export function SubmitButton({ loading, children }) {
  return (
    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
      {loading ? (
        <><span className="spinner" aria-hidden="true" /> Sending…</>
      ) : (
        <>{children} <Icon name="send" size={16} /></>
      )}
    </button>
  );
}

export function FormSuccess({ title, children, actions }) {
  return (
    <div className="form-success" role="status">
      <span className="fs-icon"><Icon name="check" size={26} /></span>
      <h3 className="fs-title">{title}</h3>
      <div className="fs-body">{children}</div>
      {actions && <div className="fs-actions">{actions}</div>}
    </div>
  );
}

export function FormError({ children }) {
  return (
    <p className="form-error" role="alert">
      <Icon name="zap" size={15} /> {children}
    </p>
  );
}

// Honeypot — hidden from humans, tempting to bots.
export function Honeypot({ value, onChange }) {
  return (
    <div className="hp" aria-hidden="true">
      <label htmlFor="bot-field">Leave this field empty</label>
      <input id="bot-field" name="bot-field" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} />
    </div>
  );
}