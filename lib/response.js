/**
 * Mutate a response with Sidehack-specific defaults alongside a
 * given status code and field values.
 *
 * @param  { Object }  res     The Response Object
 * @param  { Number }  status  The status code for the response
 * @param  { Object }  fields  An object describing the fields included
 *
 * @return { void }
 */
function sendResponse(res, status, fields) {
  let payload = Object.assign({}, { status }, fields);

  res.set({
    'Access-Control-Allow-Origin': process.env.CLIENT_URL
  });
  res.status(status);
  res.json(payload);
}

export default sendResponse;
