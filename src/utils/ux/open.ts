/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

export async function open(target: string, options?: any) {
  const open = await import('open');
  return await open(target, options);
}
