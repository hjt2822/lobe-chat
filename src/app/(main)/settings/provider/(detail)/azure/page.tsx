'use client';

import { Markdown } from '@lobehub/ui';
import { AutoComplete, Input } from 'antd';
import { createStyles } from 'antd-style';
import { useTranslation } from 'react-i18next';

import { AzureProviderCard } from '@/config/modelProviders';
import { ModelProvider } from '@/libs/agent-runtime';
import { aiProviderSelectors, useAiInfraStore } from '@/store/aiInfra';
import { useUserStore } from '@/store/user';
import { modelProviderSelectors } from '@/store/user/selectors';

import { KeyVaultsConfigKey, LLMProviderApiTokenKey, LLMProviderBaseUrlKey } from '../../const';
import { SkeletonInput } from '../../features/ProviderConfig';
import { ProviderItem } from '../../type';
import ProviderDetail from '../[id]';

const useStyles = createStyles(({ css, token }) => ({
  markdown: css`
    p {
      color: ${token.colorTextDescription} !important;
    }
  `,
  tip: css`
    font-size: 12px;
    color: ${token.colorTextDescription};
  `,
}));

const providerKey = ModelProvider.Azure;

const useProviderCard = (): ProviderItem => {
  const { t } = useTranslation('modelProvider');
  const { styles } = useStyles();

  // Get the first model card's deployment name as the check model
  const checkModel = useUserStore((s) => {
    const chatModelCards = modelProviderSelectors.getModelCardsById(providerKey)(s);

    if (chatModelCards.length > 0) {
      return chatModelCards[0].deploymentName;
    }

    return 'gpt-35-turbo';
  });

  const isLoading = useAiInfraStore(aiProviderSelectors.isAiProviderConfigLoading(providerKey));

  return {
    ...AzureProviderCard,
    apiKeyItems: [
      {
        children: isLoading ? (
          <SkeletonInput />
        ) : (
          <Input.Password
            autoComplete={'new-password'}
            placeholder={t('azure.token.placeholder')}
          />
        ),
        desc: t('azure.token.desc'),
        label: t('azure.token.title'),
        name: [KeyVaultsConfigKey, LLMProviderApiTokenKey],
      },
      {
        children: isLoading ? (
          <SkeletonInput />
        ) : (
          <Input allowClear placeholder={t('azure.endpoint.placeholder')} />
        ),
        desc: t('azure.endpoint.desc'),
        label: t('azure.endpoint.title'),
        name: [KeyVaultsConfigKey, LLMProviderBaseUrlKey],
      },
      {
        children: isLoading ? (
          <SkeletonInput />
        ) : (
          <AutoComplete
            options={[
              '2024-06-01',
              '2024-02-01',
              '2024-05-01-preview',
              '2024-04-01-preview',
              '2024-03-01-preview',
              '2024-02-15-preview',
              '2023-10-01-preview',
              '2023-06-01-preview',
              '2023-05-15',
            ].map((i) => ({ label: i, value: i }))}
            placeholder={'20XX-XX-XX'}
          />
        ),
        desc: (
          <Markdown className={styles.markdown} fontSize={12} variant={'chat'}>
            {t('azure.azureApiVersion.desc')}
          </Markdown>
        ),
        label: t('azure.azureApiVersion.title'),
        name: [KeyVaultsConfigKey, 'apiVersion'],
      },
    ],
    checkModel,
    modelList: {
      azureDeployName: true,
      notFoundContent: t('azure.empty'),
      placeholder: t('azure.modelListPlaceholder'),
    },
  };
};

const Page = () => {
  const card = useProviderCard();

  return <ProviderDetail {...card} />;
};

export default Page;