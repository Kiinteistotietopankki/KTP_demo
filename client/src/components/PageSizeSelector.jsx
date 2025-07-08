import { Form } from "react-bootstrap";

function PageSizeSelector({ pageSize, setPageSize }) {
  return (
    <Form.Select
      aria-label="Sivun koko"
      value={pageSize}
      onChange={(e) => setPageSize(Number(e.target.value))}
      className="w-auto mx-auto mb-3 shadow-sm"
    >
      <option value={3}>sivukoko: 3</option>
      <option value={6}>sivukoko: 6</option>
      <option value={9}>sivukoko: 9</option>
      <option value={12}>sivukoko: 12</option>
      <option value={25}>sivukoko: 25</option>
    </Form.Select>
  );
}


export default PageSizeSelector;