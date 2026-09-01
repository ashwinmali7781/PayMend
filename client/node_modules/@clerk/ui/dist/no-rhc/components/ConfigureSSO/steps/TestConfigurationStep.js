import { useClipboard } from "../../../hooks/useClipboard.js";
import { localizationKeys } from "../../../localization/localizationKeys.js";
import { useSpinDelay } from "../../../hooks/useSpinDelay.js";
import SvgCheckmark from "../../../icons/checkmark.js";
import SvgCopy from "../../../icons/copy.js";
import SvgLink from "../../../icons/link.js";
import SvgRotateLeftRight from "../../../icons/rotate-left-right.js";
import { useLocalizations } from "../../../localization/makeLocalizable.js";
import { common } from "../../../styledSystem/common.js";
import { mqu } from "../../../styledSystem/breakpoints.js";
import { descriptors } from "../../../customizables/elementDescriptors.js";
import { useCardState } from "../../../elements/contexts/index.js";
import { Flow } from "../../../customizables/Flow.js";
import { Badge, Box, Button, Col, Dd, Dl, Dt, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from "../../../customizables/index.js";
import { IconButton } from "../../../elements/IconButton.js";
import { handleError } from "../../../utils/errorHandler.js";
import { Pagination } from "../../../elements/Pagination.js";
import { Drawer } from "../../../elements/Drawer.js";
import { useConfigureSSO } from "../ConfigureSSOContext.js";
import { Step } from "../elements/Step.js";
import { useWizard } from "../elements/Wizard/WizardContext.js";
import { TestRunHowToFixSection } from "./TestRunHowToFixSection.js";
import { useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/steps/TestConfigurationStep.tsx
const TEST_RESULTS_TABLE_COLUMN_COUNT = 3;
const TestConfigurationStep = () => {
	const { goPrev } = useWizard();
	const { organizationEnterpriseConnection: c, testRuns } = useConfigureSSO();
	const card = useCardState();
	const { rows, totalCount, isLoading: areTestRunsLoading, isFetching: areTestRunsFetching, isPolling, page: currentPage, setPage: setCurrentPage, refresh: refreshTestRuns, revalidateHasSuccessfulTestRun } = testRuns;
	const showRefreshLogsSpinner = useSpinDelay(areTestRunsFetching && !areTestRunsLoading);
	const pageCount = totalCount ? Math.ceil(totalCount / 5) : 0;
	const handleTestRunCreated = () => {
		setCurrentPage(1);
		refreshTestRuns({ armPolling: true });
	};
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "testSso",
		children: /* @__PURE__ */ jsxs(Step, {
			elementDescriptor: descriptors.configureSSOStep,
			elementId: descriptors.configureSSOStep.setId("test"),
			children: [
				/* @__PURE__ */ jsx(Step.Header, { title: localizationKeys("configureSSO.testConfigurationStep.title") }),
				/* @__PURE__ */ jsxs(Step.Body, { children: [/* @__PURE__ */ jsx(Step.Section, {
					sx: (theme) => ({
						borderBottomWidth: theme.borderWidths.$normal,
						borderBottomStyle: theme.borderStyles.$solid,
						borderBottomColor: theme.colors.$borderAlpha100
					}),
					children: /* @__PURE__ */ jsxs(Col, {
						gap: 3,
						children: [/* @__PURE__ */ jsx(Text, {
							as: "p",
							colorScheme: "secondary",
							localizationKey: localizationKeys("configureSSO.testConfigurationStep.subtitle")
						}), /* @__PURE__ */ jsx(OpenTestUrlButton, { onTestRunCreated: handleTestRunCreated })]
					})
				}), /* @__PURE__ */ jsxs(Step.Section, {
					sx: (t) => ({
						flex: 1,
						minHeight: 0,
						gap: t.space.$3
					}),
					children: [/* @__PURE__ */ jsxs(Flex, {
						align: "center",
						justify: "between",
						sx: (t) => ({
							gap: t.space.$2,
							flexShrink: 0
						}),
						children: [/* @__PURE__ */ jsx(Text, {
							variant: "subtitle",
							localizationKey: localizationKeys("configureSSO.testConfigurationStep.testResults.title")
						}), /* @__PURE__ */ jsxs(Button, {
							elementDescriptor: descriptors.configureSSOTestRefreshButton,
							variant: "bordered",
							colorScheme: "secondary",
							size: "xs",
							onClick: () => void refreshTestRuns(),
							isDisabled: showRefreshLogsSpinner,
							sx: (t) => ({ gap: t.space.$1x5 }),
							children: [showRefreshLogsSpinner ? /* @__PURE__ */ jsx(Spinner, {
								elementDescriptor: descriptors.spinner,
								size: "xs"
							}) : /* @__PURE__ */ jsx(Icon, {
								icon: SvgRotateLeftRight,
								size: "sm",
								colorScheme: "neutral"
							}), /* @__PURE__ */ jsx(Text, {
								as: "span",
								localizationKey: localizationKeys("configureSSO.testConfigurationStep.testResults.actionLabel__refresh")
							})]
						})]
					}), /* @__PURE__ */ jsx(Col, {
						sx: {
							flex: 1,
							minHeight: 0
						},
						children: /* @__PURE__ */ jsx(TestResultsTable, {
							rows,
							isPolling,
							isLoading: areTestRunsLoading,
							page: currentPage,
							pageCount,
							pageSize: 5,
							totalCount: totalCount ?? 0,
							onPageChange: setCurrentPage
						})
					})]
				})] }),
				card.error ? /* @__PURE__ */ jsx(Box, {
					elementDescriptor: descriptors.configureSSOTestError,
					sx: (t) => ({
						flexShrink: 0,
						paddingInline: t.space.$5,
						paddingBlock: t.space.$3,
						borderTopWidth: t.borderWidths.$normal,
						borderTopStyle: t.borderStyles.$solid,
						borderTopColor: t.colors.$borderAlpha100
					}),
					children: /* @__PURE__ */ jsx(Text, {
						as: "p",
						variant: "body",
						sx: (t) => ({
							color: t.colors.$danger500,
							fontSize: t.fontSizes.$sm
						}),
						children: card.error
					})
				}) : null,
				/* @__PURE__ */ jsxs(Step.Footer, { children: [
					/* @__PURE__ */ jsx(Step.Footer.Reset, {}),
					/* @__PURE__ */ jsx(Step.Footer.Previous, { onClick: () => goPrev() }),
					/* @__PURE__ */ jsx(ContinueTestSsoStepButton, {
						hasSuccessfulTestRun: c.hasSuccessfulTestRun,
						revalidateHasSuccessfulTestRun
					})
				] })
			]
		})
	});
};
const ContinueTestSsoStepButton = ({ hasSuccessfulTestRun, revalidateHasSuccessfulTestRun }) => {
	const { t } = useLocalizations();
	const card = useCardState();
	const { goNext } = useWizard();
	const [isValidating, setIsValidating] = useState(false);
	const isLoading = useSpinDelay(isValidating);
	const advance = () => {
		card.setError(void 0);
		goNext();
	};
	const handleContinue = async () => {
		if (hasSuccessfulTestRun) {
			advance();
			return;
		}
		setIsValidating(true);
		try {
			if (await revalidateHasSuccessfulTestRun()) {
				advance();
				return;
			}
			card.setError(t(localizationKeys("configureSSO.testConfigurationStep.error__noSuccessfulTestRun")));
		} catch (err) {
			handleError(err, [], card.setError);
		} finally {
			setIsValidating(false);
		}
	};
	return /* @__PURE__ */ jsx(Step.Footer.Continue, {
		onClick: handleContinue,
		isLoading
	});
};
const TestResultsTable = ({ rows, isLoading, isPolling, page, pageCount, pageSize, totalCount, onPageChange }) => {
	const { t } = useLocalizations();
	const { contentRef } = useConfigureSSO();
	const [selectedTestRun, setSelectedTestRun] = useState(null);
	const drawerTitle = selectedTestRun?.status === "failed" ? selectedTestRun.logs?.[0]?.shortMessage || t(localizationKeys("configureSSO.testConfigurationStep.testRunDetails.title")) : t(localizationKeys("configureSSO.testConfigurationStep.testRunDetails.title"));
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(Flex, {
			direction: "col",
			sx: (t) => ({
				width: "100%",
				flex: "0 1 auto",
				minHeight: 0,
				overflowY: "auto",
				borderWidth: t.borderWidths.$normal,
				borderStyle: t.borderStyles.$solid,
				borderColor: t.colors.$borderAlpha150,
				borderRadius: t.radii.$lg,
				...common.unstyledScrollbar(t),
				[mqu.sm]: {
					overflowX: "auto",
					padding: t.space.$0x25
				}
			}),
			children: /* @__PURE__ */ jsxs(Table, {
				elementDescriptor: descriptors.configureSSOTestResultsTable,
				tableHeadVisuallyHidden: !rows.length,
				sx: (t) => ({
					background: t.colors.$colorBackground,
					"&&": {
						border: "none",
						borderRadius: 0
					}
				}),
				children: [/* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [
					/* @__PURE__ */ jsx(Th, { localizationKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.runDetails.timestamp") }),
					/* @__PURE__ */ jsx(Th, { localizationKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.runDetails.sectionTitle") }),
					/* @__PURE__ */ jsx(Th, { localizationKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.runDetails.status") })
				] }) }), /* @__PURE__ */ jsx(Tbody, { children: isLoading || isPolling ? /* @__PURE__ */ jsx(Tr, { children: /* @__PURE__ */ jsx(Td, {
					colSpan: TEST_RESULTS_TABLE_COLUMN_COUNT,
					children: /* @__PURE__ */ jsxs(Flex, {
						direction: "col",
						align: "center",
						gap: 2,
						sx: (t) => ({ padding: `${t.space.$10} 0` }),
						children: [/* @__PURE__ */ jsx(Spinner, {
							colorScheme: "primary",
							elementDescriptor: descriptors.configureSSOTestResultsLoadingSpinner
						}), /* @__PURE__ */ jsx(Text, {
							colorScheme: "secondary",
							localizationKey: isPolling ? localizationKeys("configureSSO.testConfigurationStep.testResults.polling") : void 0
						})]
					})
				}) }) : !rows.length ? /* @__PURE__ */ jsx(Tr, { children: /* @__PURE__ */ jsx(Td, {
					colSpan: TEST_RESULTS_TABLE_COLUMN_COUNT,
					children: /* @__PURE__ */ jsxs(Flex, {
						elementDescriptor: descriptors.configureSSOTestResultsEmpty,
						direction: "col",
						align: "center",
						justify: "center",
						sx: (t) => ({
							padding: `${t.space.$10} 0`,
							flex: 1,
							gap: t.space.$1,
							textAlign: "center"
						}),
						children: [/* @__PURE__ */ jsx(Text, {
							variant: "subtitle",
							localizationKey: localizationKeys("configureSSO.testConfigurationStep.testResults.empty.title")
						}), /* @__PURE__ */ jsx(Text, {
							colorScheme: "secondary",
							localizationKey: localizationKeys("configureSSO.testConfigurationStep.testResults.empty.subtitle")
						})]
					})
				}) }) : rows.map((row) => /* @__PURE__ */ jsxs(Tr, {
					elementDescriptor: descriptors.configureSSOTestResultsRow,
					onClick: () => setSelectedTestRun(row),
					sx: (t) => ({
						cursor: "pointer",
						"&:hover > td": { backgroundColor: t.colors.$neutralAlpha50 }
					}),
					children: [
						/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(TestRunTimestampCell, { testRun: row }) }),
						/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(TestRunDetailsCell, { testRun: row }) }),
						/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(TestRunStatusCell, { testRun: row }) })
					]
				}, row.id)) })]
			})
		}),
		pageCount > 1 ? /* @__PURE__ */ jsx(Box, {
			sx: { flexShrink: 0 },
			children: /* @__PURE__ */ jsx(Pagination, {
				page: Math.min(page, pageCount),
				count: pageCount,
				onChange: onPageChange,
				siblingCount: 1,
				rowInfo: {
					allRowsCount: totalCount,
					startingRow: totalCount > 0 ? Math.max(0, (page - 1) * pageSize) + 1 : 0,
					endingRow: Math.min(page * pageSize, totalCount)
				}
			})
		}) : null,
		/* @__PURE__ */ jsxs(Drawer.Root, {
			open: selectedTestRun !== null,
			onOpenChange: (open) => {
				if (!open) setSelectedTestRun(null);
			},
			strategy: "absolute",
			portalProps: { root: contentRef },
			children: [/* @__PURE__ */ jsx(Drawer.Overlay, {}), /* @__PURE__ */ jsxs(Drawer.Content, { children: [/* @__PURE__ */ jsx(Drawer.Header, { title: drawerTitle }), selectedTestRun ? /* @__PURE__ */ jsx(TestRunDetailsBody, { testRun: selectedTestRun }) : null] })]
		})
	] });
};
const useTestRunFormattedTimestamp = (testRun) => {
	const { locale } = useLocalizations();
	if (!testRun.createdAt) return null;
	return {
		time: new Intl.DateTimeFormat(locale, { timeStyle: "medium" }).format(testRun.createdAt),
		day: new Intl.DateTimeFormat(locale, {
			month: "short",
			day: "numeric"
		}).format(testRun.createdAt)
	};
};
const TestRunTimestampCell = ({ testRun }) => {
	const formatted = useTestRunFormattedTimestamp(testRun);
	if (!formatted) return null;
	return /* @__PURE__ */ jsxs(Flex, {
		gap: 2,
		align: "baseline",
		sx: { whiteSpace: "nowrap" },
		children: [/* @__PURE__ */ jsx(Text, { children: formatted.time }), /* @__PURE__ */ jsx(Text, {
			colorScheme: "secondary",
			children: formatted.day
		})]
	});
};
const DetailRow = ({ title, children }) => /* @__PURE__ */ jsxs(Box, {
	as: "div",
	sx: (t) => ({
		display: "grid",
		gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
		gap: t.space.$2
	}),
	children: [/* @__PURE__ */ jsx(Dt, {
		localizationKey: title,
		sx: (t) => ({
			color: t.colors.$colorForeground,
			...common.textVariants(t).subtitle
		})
	}), /* @__PURE__ */ jsx(Dd, {
		sx: (t) => ({
			display: "grid",
			justifyContent: "end",
			color: t.colors.$colorForeground
		}),
		children
	})]
});
const TestRunDetailsBody = ({ testRun }) => {
	const formatted = useTestRunFormattedTimestamp(testRun);
	const failedLog = testRun.status === "failed" ? testRun.logs?.[0] : null;
	return /* @__PURE__ */ jsxs(Drawer.Body, {
		sx: (t) => ({
			display: "flex",
			flexDirection: "column",
			flex: 1,
			overflowY: "auto",
			padding: t.space.$4,
			gap: t.space.$4
		}),
		children: [
			/* @__PURE__ */ jsx(Heading, {
				as: "h3",
				textVariant: "h3",
				localizationKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.runDetails.sectionTitle")
			}),
			/* @__PURE__ */ jsxs(Dl, {
				sx: (t) => ({
					display: "grid",
					gridRowGap: t.space.$2
				}),
				children: [formatted ? /* @__PURE__ */ jsx(DetailRow, {
					title: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.runDetails.timestamp"),
					children: /* @__PURE__ */ jsxs(Flex, {
						gap: 2,
						align: "baseline",
						sx: { whiteSpace: "nowrap" },
						children: [/* @__PURE__ */ jsx(Text, { children: formatted.time }), /* @__PURE__ */ jsx(Text, {
							colorScheme: "secondary",
							children: formatted.day
						})]
					})
				}) : null, testRun.status === "failed" ? failedLog?.code ? /* @__PURE__ */ jsx(DetailRow, {
					title: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.runDetails.errorCode"),
					children: /* @__PURE__ */ jsx(Text, {
						sx: (t) => ({ fontFamily: t.fonts.$mono }),
						children: failedLog.code
					})
				}) : null : /* @__PURE__ */ jsx(DetailRow, {
					title: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.runDetails.status"),
					children: /* @__PURE__ */ jsx(TestRunStatusCell, { testRun })
				})]
			}),
			testRun.status === "failed" && failedLog?.message ? /* @__PURE__ */ jsx(FullMessageBlock, { message: failedLog.message }) : null,
			testRun.status === "failed" ? /* @__PURE__ */ jsx(TestRunHowToFixSection, { errorCode: failedLog?.code }) : null,
			testRun.status === "success" ? /* @__PURE__ */ jsx(ParsedUserInfoSection, { parsedUserInfo: testRun.parsedUserInfo }) : null
		]
	});
};
const ParsedUserInfoSection = ({ parsedUserInfo }) => {
	if (!parsedUserInfo?.emailAddress && !parsedUserInfo?.firstName) return null;
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.configureSSOTestRunParsedUserInfo,
		direction: "col",
		gap: 3,
		sx: (t) => ({
			borderTopWidth: t.borderWidths.$normal,
			borderTopStyle: t.borderStyles.$solid,
			borderTopColor: t.colors.$borderAlpha100,
			paddingTop: t.space.$4
		}),
		children: [/* @__PURE__ */ jsx(Heading, {
			as: "h3",
			textVariant: "h3",
			localizationKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.parsedUserInfo.sectionTitle")
		}), /* @__PURE__ */ jsxs(Dl, {
			sx: (t) => ({
				display: "grid",
				gridRowGap: t.space.$2
			}),
			children: [parsedUserInfo.emailAddress ? /* @__PURE__ */ jsx(DetailRow, {
				title: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.parsedUserInfo.email"),
				children: /* @__PURE__ */ jsx(Text, {
					sx: (t) => ({ fontFamily: t.fonts.$mono }),
					children: parsedUserInfo.emailAddress
				})
			}) : null, parsedUserInfo.firstName ? /* @__PURE__ */ jsx(DetailRow, {
				title: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.parsedUserInfo.firstName"),
				children: /* @__PURE__ */ jsx(Text, {
					sx: (t) => ({ fontFamily: t.fonts.$mono }),
					children: parsedUserInfo.firstName
				})
			}) : null]
		})]
	});
};
const FullMessageBlock = ({ message }) => {
	const { t } = useLocalizations();
	const { onCopy, hasCopied } = useClipboard(message);
	const copyLabel = t(localizationKeys(hasCopied ? "configureSSO.testConfigurationStep.testRunDetails.runDetails.actionLabel__copied" : "configureSSO.testConfigurationStep.testRunDetails.runDetails.actionLabel__copy"));
	return /* @__PURE__ */ jsxs(Flex, {
		direction: "col",
		gap: 2,
		children: [/* @__PURE__ */ jsxs(Flex, {
			justify: "between",
			align: "center",
			gap: 4,
			children: [/* @__PURE__ */ jsx(Text, {
				colorScheme: "secondary",
				localizationKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.runDetails.fullMessage")
			}), /* @__PURE__ */ jsx(IconButton, {
				elementDescriptor: descriptors.configureSSOTestRunFullMessageCopyButton,
				variant: "ghost",
				colorScheme: "neutral",
				size: "xs",
				icon: hasCopied ? SvgCheckmark : SvgCopy,
				"aria-label": copyLabel,
				onClick: () => onCopy()
			})]
		}), /* @__PURE__ */ jsx(Box, {
			elementDescriptor: descriptors.configureSSOTestRunFullMessage,
			as: "pre",
			sx: (t) => ({
				margin: 0,
				padding: t.space.$3,
				backgroundColor: t.colors.$colorBackground,
				borderWidth: t.borderWidths.$normal,
				borderStyle: t.borderStyles.$solid,
				borderColor: t.colors.$borderAlpha150,
				borderRadius: t.radii.$md,
				boxShadow: t.shadows.$cardContentShadow,
				fontFamily: t.fonts.$mono,
				fontSize: t.fontSizes.$sm,
				color: t.colors.$colorForeground,
				whiteSpace: "pre-wrap",
				wordBreak: "break-word"
			}),
			children: message
		})]
	});
};
const TestRunDetailsCell = ({ testRun }) => {
	if (testRun.status === "pending") return /* @__PURE__ */ jsx(Flex, {
		sx: (t) => ({ fontFamily: t.fonts.$mono }),
		children: /* @__PURE__ */ jsx(Text, { children: "-" })
	});
	if (testRun.status === "success") return /* @__PURE__ */ jsx(Flex, {
		sx: (t) => ({ fontFamily: t.fonts.$mono }),
		children: /* @__PURE__ */ jsx(Text, { children: testRun.parsedUserInfo?.emailAddress })
	});
	return /* @__PURE__ */ jsx(Flex, {
		sx: (t) => ({ fontFamily: t.fonts.$mono }),
		children: /* @__PURE__ */ jsx(Text, { children: testRun.logs?.[0]?.shortMessage })
	});
};
const TestRunStatusCell = ({ testRun }) => {
	if (testRun.status === "success") return /* @__PURE__ */ jsx(Badge, {
		elementDescriptor: descriptors.configureSSOTestRunStatusBadge,
		elementId: descriptors.configureSSOTestRunStatusBadge.setId("success"),
		colorScheme: "success",
		localizationKey: localizationKeys("configureSSO.testConfigurationStep.testResults.status__success")
	});
	if (testRun.status === "failed") return /* @__PURE__ */ jsx(Badge, {
		elementDescriptor: descriptors.configureSSOTestRunStatusBadge,
		elementId: descriptors.configureSSOTestRunStatusBadge.setId("failed"),
		colorScheme: "danger",
		localizationKey: localizationKeys("configureSSO.testConfigurationStep.testResults.status__failed")
	});
	return /* @__PURE__ */ jsx(Badge, {
		elementDescriptor: descriptors.configureSSOTestRunStatusBadge,
		elementId: descriptors.configureSSOTestRunStatusBadge.setId("pending"),
		colorScheme: "warning",
		localizationKey: localizationKeys("configureSSO.testConfigurationStep.testResults.status__pending")
	});
};
const OpenTestUrlButton = ({ onTestRunCreated }) => {
	const card = useCardState();
	const { enterpriseConnection, enterpriseConnectionMutations: { createTestRun } } = useConfigureSSO();
	const [isCreatingTestRun, setIsCreatingTestRun] = useState(false);
	const openTestRun = () => {
		if (!enterpriseConnection) return;
		setIsCreatingTestRun(true);
		createTestRun(enterpriseConnection.id).then(({ url }) => {
			onTestRunCreated?.(url);
			window.open(url, "_blank", "noopener,noreferrer");
		}).catch((err) => handleError(err, [], card.setError)).finally(() => setIsCreatingTestRun(false));
	};
	return /* @__PURE__ */ jsxs(Button, {
		elementDescriptor: descriptors.configureSSOTestUrlOpenButton,
		id: "testSsoUrl",
		variant: "bordered",
		colorScheme: "secondary",
		size: "xs",
		onClick: openTestRun,
		isDisabled: isCreatingTestRun,
		sx: (t) => ({
			gap: t.space.$1x5,
			width: "fit-content"
		}),
		children: [isCreatingTestRun ? /* @__PURE__ */ jsx(Spinner, {
			elementDescriptor: descriptors.spinner,
			size: "sm"
		}) : /* @__PURE__ */ jsx(Icon, {
			icon: SvgLink,
			size: "sm",
			colorScheme: "neutral"
		}), /* @__PURE__ */ jsx(Text, {
			as: "span",
			localizationKey: localizationKeys("configureSSO.testConfigurationStep.testUrl.actionLabel__open")
		})]
	});
};

//#endregion
export { TestConfigurationStep };
//# sourceMappingURL=TestConfigurationStep.js.map