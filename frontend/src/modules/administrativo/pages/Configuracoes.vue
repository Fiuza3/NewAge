<template>
  <div class="configuracoes">
    <h1 class="na-mb-3">Configurações</h1>
    
    <base-card>
      <v-form ref="form" @submit.prevent="salvar" v-model="formValido">
        <h2 class="text-h6 na-mb-3">Configurações Gerais</h2>
        
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="configuracao.moeda"
              :items="moedas"
              label="Moeda"
              :rules="[v => !!v || 'Moeda é obrigatória']"
              required
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-select
              v-model="configuracao.idioma"
              :items="idiomas"
              label="Idioma"
              :rules="[v => !!v || 'Idioma é obrigatório']"
              required
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-select
              v-model="configuracao.formatoData"
              :items="formatosData"
              label="Formato de Data"
              :rules="[v => !!v || 'Formato de data é obrigatório']"
              required
            ></v-select>
          </v-col>
        </v-row>
        
        <h2 class="text-h6 na-mb-3 na-mt-3">Parâmetros do Sistema</h2>
        
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="configuracao.casasDecimais"
              :items="[0, 1, 2, 3, 4]"
              label="Casas Decimais"
              :rules="[v => v !== null || 'Casas decimais é obrigatório']"
              required
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-switch
              v-model="configuracao.outrosParametros.exibirLogos"
              label="Exibir Logos"
              color="primary"
              hide-details
            ></v-switch>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-switch
              v-model="configuracao.outrosParametros.notificacoesEmail"
              label="Notificações por E-mail"
              color="primary"
              hide-details
            ></v-switch>
          </v-col>
        </v-row>
        
        <div class="d-flex justify-end na-mt-3">
          <v-btn
            color="primary"
            type="submit"
            :loading="salvando"
            :disabled="!formValido"
          >
            Salvar Configurações
          </v-btn>
        </div>
      </v-form>
    </base-card>
    
    <!-- Snackbar para notificações -->
    <base-snackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      :color="snackbar.color"
    ></base-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'
import configuracaoService, { Configuracao } from '../services/configuracaoService'

export default defineComponent({
  name: 'Configuracoes',
  components: {
    BaseCard,
    BaseSnackbar
  },
  setup() {
    const form = ref(null)
    const formValido = ref(false)
    const salvando = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Dados de configuração
    const configuracao = ref<Configuracao>({
      moeda: 'BRL',
      idioma: 'pt-BR',
      formatoData: 'DD/MM/YYYY',
      casasDecimais: 2,
      outrosParametros: {
        exibirLogos: true,
        notificacoesEmail: false
      }
    })
    
    // Opções para os selects
    const moedas = [
      { title: 'Real (R$)', value: 'BRL' },
      { title: 'Dólar ($)', value: 'USD' },
      { title: 'Euro (€)', value: 'EUR' }
    ]
    
    const idiomas = [
      { title: 'Português (Brasil)', value: 'pt-BR' },
      { title: 'Inglês (EUA)', value: 'en-US' },
      { title: 'Espanhol', value: 'es' }
    ]
    
    const formatosData = [
      { title: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
      { title: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
      { title: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
    ]
    
    // Carrega as configurações
    const carregarConfiguracoes = async () => {
      try {
        const data = await configuracaoService.buscar()
        configuracao.value = data
      } catch (error) {
        mostrarNotificacao('Erro ao carregar configurações', 'error')
        console.error(error)
      }
    }
    
    // Salva as configurações
    const salvar = async () => {
      salvando.value = true
      
      try {
        await configuracaoService.atualizar(configuracao.value)
        mostrarNotificacao('Configurações salvas com sucesso')
      } catch (error) {
        mostrarNotificacao('Erro ao salvar configurações', 'error')
        console.error(error)
      } finally {
        salvando.value = false
      }
    }
    
    // Exibe uma notificação
    const mostrarNotificacao = (texto: string, cor: string = 'success') => {
      snackbar.value = {
        show: true,
        text: texto,
        color: cor
      }
    }
    
    // Carrega as configurações ao montar o componente
    onMounted(() => {
      carregarConfiguracoes()
    })
    
    return {
      configuracao,
      moedas,
      idiomas,
      formatosData,
      form,
      formValido,
      salvando,
      snackbar,
      salvar
    }
  }
})
</script>