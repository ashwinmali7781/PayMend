import { useRouter } from "../../router/RouteContext.js";
import { useLoadingStatus } from "../../hooks/useLoadingStatus.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgSpinner from "../../icons/spinner.js";
import { useWaitlistContext } from "../../contexts/components/Waitlist.js";
import { animations } from "../../styledSystem/animations.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Col, Flex, Icon, Text } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/Waitlist/WaitlistForm.tsx
const WaitlistForm = (props) => {
	const clerk = useClerk();
	const card = useCardState();
	const status = useLoadingStatus();
	const { navigate } = useRouter();
	const ctx = useWaitlistContext();
	const { formState } = props;
	const wizard = useWizard({ onNextStep: () => card.setError(void 0) });
	const handleSubmit = async (e) => {
		e.preventDefault();
		status.setLoading();
		card.setLoading();
		card.setError(void 0);
		const joinWaitlistParams = { emailAddress: formState.emailAddress.value };
		await clerk.joinWaitlist(joinWaitlistParams).then(() => {
			wizard.nextStep();
			setTimeout(() => {
				if (ctx.afterJoinWaitlistUrl) navigate(ctx.afterJoinWaitlistUrl);
			}, 2e3);
		}).catch((error) => {
			handleError(error, [formState.emailAddress], card.setError);
		}).finally(() => {
			status.setIdle();
			card.setIdle();
		});
	};
	return /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [/* @__PURE__ */ jsxs(Col, {
			gap: 6,
			children: [
				/* @__PURE__ */ jsxs(Header.Root, {
					showLogo: true,
					children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("waitlist.start.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("waitlist.start.subtitle") })]
				}),
				/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
				/* @__PURE__ */ jsx(Flex, {
					direction: "col",
					elementDescriptor: descriptors.main,
					gap: 6,
					children: /* @__PURE__ */ jsxs(Form.Root, {
						onSubmit: handleSubmit,
						gap: 8,
						children: [/* @__PURE__ */ jsx(Col, {
							gap: 6,
							children: /* @__PURE__ */ jsx(Form.ControlRow, {
								elementId: "emailAddress",
								children: /* @__PURE__ */ jsx(Form.PlainInput, {
									...formState.emailAddress.props,
									isRequired: true
								})
							})
						}), /* @__PURE__ */ jsx(Col, {
							center: true,
							children: /* @__PURE__ */ jsx(Form.SubmitButton, { localizationKey: localizationKeys("waitlist.start.formButton") })
						})]
					})
				})
			]
		}), /* @__PURE__ */ jsxs(Col, {
			gap: 6,
			children: [/* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("waitlist.success.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("waitlist.success.subtitle") })]
			}), ctx.afterJoinWaitlistUrl && /* @__PURE__ */ jsx(Flex, {
				direction: "col",
				elementDescriptor: descriptors.main,
				gap: 6,
				children: /* @__PURE__ */ jsx(Col, {
					center: true,
					children: /* @__PURE__ */ jsxs(Flex, {
						gap: 2,
						align: "center",
						children: [/* @__PURE__ */ jsx(Icon, {
							icon: SvgSpinner,
							sx: (t) => ({
								margin: "auto",
								width: t.sizes.$6,
								height: t.sizes.$6,
								animation: `${animations.spinning} 1s linear infinite`
							})
						}), /* @__PURE__ */ jsx(Text, {
							colorScheme: "secondary",
							localizationKey: localizationKeys("waitlist.success.message")
						})]
					})
				})
			})]
		})]
	});
};

//#endregion
export { WaitlistForm };
//# sourceMappingURL=WaitlistForm.js.map