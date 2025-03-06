// TODO: Remove this file
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  return { svgContent: await (await event.fetch('api/widgets?svg')).text() };
};
