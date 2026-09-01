import { useOptions } from "../../../contexts/OptionsContext.js";
import { useEnvironment } from "../../../contexts/EnvironmentContext.js";
import { InternalThemeProvider } from "../../../styledSystem/InternalThemeProvider.js";
import { Flex } from "../../../customizables/index.js";
import { Modal } from "../../../elements/Modal.js";
import { Portal } from "../../../elements/Portal.js";
import { ClerkLogoIcon, PromptContainer, PromptSuccessIcon, basePromptElementStyles } from "../shared.js";
import React, { forwardRef, useId, useLayoutEffect, useRef, useState } from "react";
import { createContextAndHook, useClerk } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { css } from "@emotion/react";

//#region src/components/devPrompts/EnableOrganizationsPrompt/index.tsx
const organizationsDashboardUrl = "https://dashboard.clerk.com/~/organizations-settings";
const EnableOrganizationsPromptInternal = ({ caller, onSuccess, onClose }) => {
	const clerk = useClerk();
	const [isLoading, setIsLoading] = useState(false);
	const [isEnabled, setIsEnabled] = useState(false);
	const [defaultOrganizationName, setDefaultOrganizationName] = useState(null);
	const [allowPersonalAccount, setAllowPersonalAccount] = useState(false);
	const initialFocusRef = useRef(null);
	const environment = useEnvironment();
	const radioGroupLabelId = useId();
	const options = useOptions();
	const claimUrl = options.__internal_keyless_claimKeylessApplicationUrl;
	const copyKeysUrl = options.__internal_keyless_copyInstanceKeysUrl;
	const isKeyless = Boolean(claimUrl) && Boolean(copyKeysUrl);
	const isClaimed = environment.authConfig.claimedAt !== null;
	const showKeylessClaimPath = isEnabled && isKeyless && !isClaimed;
	const isComponent = !caller.startsWith("use");
	const hasPersonalAccountsEnabled = typeof environment?.organizationSettings.forceOrganizationSelection !== "undefined";
	const handleEnableOrganizations = () => {
		setIsLoading(true);
		const params = { enable_organizations: true };
		if (hasPersonalAccountsEnabled) params.organization_allow_personal_accounts = allowPersonalAccount;
		environment.__internal_enableEnvironmentSetting(params).then(async () => {
			setDefaultOrganizationName((await clerk.user?.getOrganizationMemberships())?.data[0]?.organization.name ?? null);
			setIsEnabled(true);
			setIsLoading(false);
		}).catch(() => {
			setIsLoading(false);
		});
	};
	return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(Modal, {
		canCloseModal: false,
		containerSx: () => ({ alignItems: "center" }),
		initialFocusRef,
		children: /* @__PURE__ */ jsxs(PromptContainer, {
			sx: () => ({
				display: "flex",
				flexDirection: "column",
				width: "30rem",
				maxWidth: "calc(100vw - 2rem)"
			}),
			children: [
				/* @__PURE__ */ jsxs(Flex, {
					direction: "col",
					sx: (t) => ({
						padding: `${t.sizes.$4} ${t.sizes.$6}`,
						paddingBottom: t.sizes.$4,
						gap: t.sizes.$2
					}),
					children: [
						/* @__PURE__ */ jsxs(Flex, {
							as: "header",
							align: "center",
							sx: (t) => ({ gap: t.sizes.$2 }),
							children: [/* @__PURE__ */ jsx(CoinFlip, { isEnabled }), /* @__PURE__ */ jsx("h1", {
								css: [basePromptElementStyles, css`
                    color: white;
                    font-size: 0.875rem;
                    font-weight: 500;
                    outline: none;
                  `],
								tabIndex: -1,
								ref: initialFocusRef,
								children: isEnabled ? "Organizations feature enabled" : "Organizations feature required"
							})]
						}),
						/* @__PURE__ */ jsx(Flex, {
							direction: "col",
							align: "start",
							sx: (t) => ({ gap: t.sizes.$0x5 }),
							children: isEnabled ? /* @__PURE__ */ jsxs("p", {
								css: [basePromptElementStyles, css`
                      color: #b4b4b4;
                      font-size: 0.8125rem;
                      font-weight: 400;
                      line-height: 1.3;
                    `],
								children: [showKeylessClaimPath ? defaultOrganizationName ? `Organizations are now enabled and a default organization named "${defaultOrganizationName}" was created. Claim your application to save this configuration and access the full dashboard.` : "Organizations are now enabled! Claim your application to save this configuration and access the full dashboard." : clerk.user && defaultOrganizationName ? `The Organizations feature has been enabled for your application. A default organization named "${defaultOrganizationName}" was created automatically. You can manage or rename it in your` : `The Organizations feature has been enabled for your application. You can manage it in your`, !showKeylessClaimPath && /* @__PURE__ */ jsxs(Fragment$1, { children: [
									" ",
									/* @__PURE__ */ jsx(Link, {
										href: organizationsDashboardUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										children: "dashboard"
									}),
									"."
								] })]
							}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("p", {
								id: radioGroupLabelId,
								css: [basePromptElementStyles, css`
                        color: #b4b4b4;
                        font-size: 0.8125rem;
                        font-weight: 400;
                        line-height: 1.23;
                      `],
								children: [
									"Enable Organizations to use",
									" ",
									/* @__PURE__ */ jsx("code", {
										css: [basePromptElementStyles, css`
                          font-size: 0.75rem;
                          color: white;
                          font-family: monospace;
                          line-height: 1.23;
                        `],
										children: isComponent ? `<${caller} />` : caller
									}),
									" "
								]
							}), /* @__PURE__ */ jsx(Link, {
								href: "https://clerk.com/docs/guides/organizations/overview",
								target: "_blank",
								rel: "noopener noreferrer",
								children: "Learn more"
							})] })
						}),
						hasPersonalAccountsEnabled && !isEnabled && /* @__PURE__ */ jsx(Flex, {
							sx: (t) => ({ marginTop: t.sizes.$2 }),
							direction: "col",
							children: /* @__PURE__ */ jsxs(RadioGroup, {
								value: allowPersonalAccount ? "optional" : "required",
								onChange: (value) => setAllowPersonalAccount(value === "optional"),
								labelledBy: radioGroupLabelId,
								children: [/* @__PURE__ */ jsx(RadioGroupItem, {
									value: "required",
									label: /* @__PURE__ */ jsxs(Flex, {
										wrap: "wrap",
										sx: (t) => ({
											columnGap: t.sizes.$2,
											rowGap: t.sizes.$1
										}),
										children: [/* @__PURE__ */ jsx("span", { children: "Membership required" }), /* @__PURE__ */ jsx(PromptBadge, { children: "Standard" })]
									}),
									description: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
										className: "block",
										children: "Users need to belong to at least one organization."
									}), /* @__PURE__ */ jsx("span", { children: "Common for most B2B SaaS applications" })] })
								}), /* @__PURE__ */ jsx(RadioGroupItem, {
									value: "optional",
									label: "Membership optional",
									description: "Users can work outside of an organization with a personal account"
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ jsx("span", { css: css`
              height: 1px;
              display: block;
              width: calc(100% - 2px);
              margin-inline: auto;
              background-color: #151515;
              box-shadow: 0px 1px 0px 0px #424242;
            ` }),
				/* @__PURE__ */ jsx(Flex, {
					justify: "center",
					sx: (t) => ({
						padding: `${t.sizes.$4} ${t.sizes.$6}`,
						gap: t.sizes.$3,
						justifyContent: "flex-end"
					}),
					children: isEnabled ? showKeylessClaimPath ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(PromptButton, {
						variant: "outline",
						onClick: () => {
							onSuccess?.();
						},
						children: clerk.user ? "Continue" : "I’ll do it later"
					}), /* @__PURE__ */ jsx(Link, {
						href: claimUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						onClick: (e) => {
							if (claimUrl) {
								const url = new URL(claimUrl);
								url.searchParams.append("return_url", window.location.href);
								e.currentTarget.href = url.href;
							}
							clerk.__internal_closeEnableOrganizationsPrompt?.();
						},
						css: css`
                      ${baseButtonStyles}
                      ${buttonSolidStyles}
                      color: #fde047;
                      text-decoration: none;
                    `,
						children: "Claim your application"
					})] }) : /* @__PURE__ */ jsx(PromptButton, {
						variant: "solid",
						onClick: () => {
							if (!clerk.user) {
								clerk.redirectToSignIn();
								clerk.__internal_closeEnableOrganizationsPrompt?.();
							} else onSuccess?.();
						},
						children: clerk.user ? "Continue" : "Sign in to continue"
					}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(PromptButton, {
						variant: "outline",
						onClick: () => {
							clerk?.__internal_closeEnableOrganizationsPrompt?.();
							onClose?.();
						},
						children: "I'll remove it myself"
					}), /* @__PURE__ */ jsx(PromptButton, {
						variant: "solid",
						onClick: handleEnableOrganizations,
						disabled: isLoading,
						children: "Enable Organizations"
					})] })
				})
			]
		})
	}) });
};
/**
* A prompt that allows the user to enable the Organizations feature for their development instance
* @internal
*/
const EnableOrganizationsPrompt = (props) => {
	return /* @__PURE__ */ jsx(InternalThemeProvider, { children: /* @__PURE__ */ jsx(EnableOrganizationsPromptInternal, { ...props }) });
};
const baseButtonStyles = css`
  ${basePromptElementStyles};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12px;
  color: white;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.32);
  white-space: nowrap;
  user-select: none;
  color: white;
  outline: none;

  &:not(:disabled) {
    transition: 120ms ease-in-out;
    transition-property: background-color, border-color, box-shadow, color;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible:not(:disabled) {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;
const buttonSolidStyles = css`
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 30.5%, rgba(0, 0, 0, 0.05) 100%), #454545;
  box-shadow:
    0 0 3px 0 rgba(253, 224, 71, 0) inset,
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 1px 0 0 rgba(255, 255, 255, 0.04) inset,
    0 0 0 1px rgba(0, 0, 0, 0.12),
    0 1.5px 2px 0 rgba(0, 0, 0, 0.48);

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 30.5%, rgba(0, 0, 0, 0.15) 100%), #5f5f5f;
    box-shadow:
      0 0 3px 0 rgba(253, 224, 71, 0) inset,
      0 0 0 1px rgba(255, 255, 255, 0.04) inset,
      0 1px 0 0 rgba(255, 255, 255, 0.04) inset,
      0 0 0 1px rgba(0, 0, 0, 0.12),
      0 1.5px 2px 0 rgba(0, 0, 0, 0.48);
  }
`;
const buttonVariantStyles = {
	solid: buttonSolidStyles,
	outline: css`
  border: 1px solid rgba(118, 118, 132, 0.25);
  background: rgba(69, 69, 69, 0.1);

  &:hover:not(:disabled) {
    border-color: rgba(118, 118, 132, 0.5);
  }
`
};
const PromptButton = forwardRef(({ variant = "solid", ...props }, ref) => {
	return /* @__PURE__ */ jsx("button", {
		ref,
		type: "button",
		css: [baseButtonStyles, buttonVariantStyles[variant]],
		...props
	});
});
const PromptBadge = ({ children }) => {
	return /* @__PURE__ */ jsx("span", {
		css: css`
        ${basePromptElementStyles};
        display: inline-flex;
        align-items: center;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-size: 0.6875rem;
        font-weight: 500;
        line-height: 1.23;
        background-color: #ebebeb;
        color: #2b2b34;
        white-space: nowrap;
      `,
		children
	});
};
const [RadioGroupContext, useRadioGroup] = createContextAndHook("RadioGroupContext");
const RadioGroup = ({ value, onChange, children, labelledBy }) => {
	const name = useId();
	const contextValue = React.useMemo(() => ({ value: {
		name,
		value,
		onChange
	} }), [
		name,
		value,
		onChange
	]);
	return /* @__PURE__ */ jsx(RadioGroupContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ jsx(Flex, {
			role: "radiogroup",
			direction: "col",
			gap: 3,
			"aria-orientation": "vertical",
			"aria-labelledby": labelledBy,
			children
		})
	});
};
const RADIO_INDICATOR_SIZE = "1rem";
const RADIO_GAP = "0.5rem";
const RadioGroupItem = ({ value, label, description }) => {
	const { name, value: selectedValue, onChange } = useRadioGroup();
	const descriptionId = useId();
	const checked = value === selectedValue;
	return /* @__PURE__ */ jsxs(Flex, {
		direction: "col",
		gap: 1,
		children: [/* @__PURE__ */ jsxs("label", {
			css: css`
          ${basePromptElementStyles};
          display: flex;
          align-items: flex-start;
          gap: ${RADIO_GAP};
          cursor: pointer;
          user-select: none;

          &:has(input:focus-visible) > span:first-of-type {
            outline: 2px solid white;
            outline-offset: 2px;
          }

          &:hover:has(input:not(:checked)) > span:first-of-type {
            background-color: rgba(255, 255, 255, 0.08);
          }

          &:hover:has(input:checked) > span:first-of-type {
            background-color: rgba(108, 71, 255, 0.8);
            background-color: color-mix(in srgb, #6c47ff 80%, transparent);
          }
        `,
			children: [
				/* @__PURE__ */ jsx("input", {
					type: "radio",
					name,
					value,
					checked,
					onChange: () => onChange(value),
					"aria-describedby": description ? descriptionId : void 0,
					css: css`
            ${basePromptElementStyles};
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          `
				}),
				/* @__PURE__ */ jsx("span", {
					"aria-hidden": "true",
					css: css`
            ${basePromptElementStyles};
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: ${RADIO_INDICATOR_SIZE};
            height: ${RADIO_INDICATOR_SIZE};
            margin-top: 0.125rem;
            flex-shrink: 0;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.3);
            background-color: transparent;
            transition: 120ms ease-in-out;
            transition-property: border-color, background-color, box-shadow;

            ${checked && css`
              border-width: 2px;
              border-color: #6c47ff;
              background-color: #6c47ff;
              background-color: color-mix(in srgb, #6c47ff 100%, transparent);
              box-shadow: 0 0 0 2px rgba(108, 71, 255, 0.2);
            `}

            &::after {
              content: '';
              position: absolute;
              width: 0.375rem;
              height: 0.375rem;
              border-radius: 50%;
              background-color: white;
              opacity: ${checked ? 1 : 0};
              transform: scale(${checked ? 1 : 0});
              transition: 120ms ease-in-out;
              transition-property: opacity, transform;
            }
          `
				}),
				/* @__PURE__ */ jsx("span", {
					css: [basePromptElementStyles, css`
              font-size: 0.875rem;
              font-weight: 500;
              line-height: 1.25;
              color: white;
            `],
					children: label
				})
			]
		}), description && /* @__PURE__ */ jsx("span", {
			id: descriptionId,
			css: [basePromptElementStyles, css`
              padding-inline-start: calc(${RADIO_INDICATOR_SIZE} + ${RADIO_GAP});
              font-size: 0.75rem;
              line-height: 1.33;
              color: #c3c3c6;
              text-wrap: pretty;
            `],
			children: description
		})]
	});
};
const Link = forwardRef(({ children, css: cssProp, ...props }, ref) => {
	return /* @__PURE__ */ jsx("a", {
		ref,
		...props,
		css: [
			basePromptElementStyles,
			css`
            color: #a8a8ff;
            font-size: inherit;
            font-weight: 500;
            line-height: 1.3;
            font-size: 0.8125rem;
            min-width: 0;
          `,
			cssProp
		],
		children
	});
});
const CoinFlip = ({ isEnabled }) => {
	const [rotation, setRotation] = useState(0);
	useLayoutEffect(() => {
		if (isEnabled) {
			setRotation((r) => r === 0 ? 180 : 0);
			return;
		}
		const interval = setInterval(() => {
			setRotation((r) => r === 0 ? 180 : 0);
		}, 2e3);
		return () => clearInterval(interval);
	}, [isEnabled]);
	let frontFaceType = "idle";
	let backFaceType = "warning";
	if (isEnabled) if (rotation === 0) {
		frontFaceType = "success";
		backFaceType = "warning";
	} else {
		backFaceType = "success";
		frontFaceType = "idle";
	}
	const renderContent = (type) => {
		switch (type) {
			case "idle": return /* @__PURE__ */ jsx(ClerkLogoIcon, {});
			case "success": return /* @__PURE__ */ jsx(PromptSuccessIcon, { css: css`
              width: 1.25rem;
              height: 1.25rem;
            ` });
			case "warning": return /* @__PURE__ */ jsxs("svg", {
				css: css`
              width: 1.25rem;
              height: 1.25rem;
            `,
				viewBox: "0 0 20 20",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				children: [
					/* @__PURE__ */ jsx("path", {
						opacity: "0.2",
						d: "M17.25 10C17.25 14.0041 14.0041 17.25 10 17.25C5.99594 17.25 2.75 14.0041 2.75 10C2.75 5.99594 5.99594 2.75 10 2.75C14.0041 2.75 17.25 5.99594 17.25 10Z",
						fill: "#EAB308"
					}),
					/* @__PURE__ */ jsx("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 13.5899 6.41015 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z",
						fill: "#EAB308"
					}),
					/* @__PURE__ */ jsx("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M10 6C10.5523 6 11 6.44772 11 7V9C11 9.55228 10.5523 10 10 10C9.44772 10 9 9.55228 9 9V7C9 6.44772 9.44772 6 10 6Z",
						fill: "#EAB308"
					}),
					/* @__PURE__ */ jsx("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M10 12C10.5523 12 11 12.4477 11 13V13.01C11 13.5623 10.5523 14.01 10 14.01C9.44772 14.01 9 13.5623 9 13.01V13C9 12.4477 9.44772 12 10 12Z",
						fill: "#EAB308"
					})
				]
			});
		}
	};
	return /* @__PURE__ */ jsx("div", {
		css: css`
        perspective: 1000px;
        width: 1.25rem;
        height: 1.25rem;
      `,
		children: /* @__PURE__ */ jsxs("div", {
			css: css`
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s ease-in-out;
          transform: rotateY(${rotation}deg);

          @media (prefers-reduced-motion: reduce) {
            transition: none;
          }
        `,
			children: [/* @__PURE__ */ jsx("span", {
				"aria-hidden": true,
				css: css`
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-font-smoothing: antialiased;
            transform: rotateY(0deg);
          `,
				children: renderContent(frontFaceType)
			}), /* @__PURE__ */ jsx("span", {
				"aria-hidden": true,
				css: css`
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            transform: rotateY(180deg);
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-font-smoothing: antialiased;
          `,
				children: renderContent(backFaceType)
			})]
		})
	});
};

//#endregion
export { EnableOrganizationsPrompt };
//# sourceMappingURL=index.js.map