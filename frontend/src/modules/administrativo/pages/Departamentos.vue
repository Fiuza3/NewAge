<template>
  <div class="departamentos">
    <div class="d-flex justify-space-between align-center na-mb-3">
      <h1>Departamentos</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/administrativo/departamentos/novo">
        Novo Departamento
      </v-btn>
    </div>
    
    <base-card>
      <div class="d-flex align-center na-mb-3">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar departamentos"
          single-line
          hide-details
          class="mr-3"
        ></v-text-field>
        
        <v-select
          v-model="empresaFiltro"
          :items="empresas"
          item-title="nome"
          item-value="id"
          label="Filtrar por empresa"
          clearable
          hide-details
          @update:model-value="filtrarPorEmpresa"
        ></v-select>
      </div>
      
      <base-table
        :headers="headers"
        :items="departamentosFiltrados"
        :loading="loading"
        :search="search"
      >
        <template v-slot:item.acoes="{ item }">
          <v-btn
            icon
            variant="text"
            color="primary"
            :to="`/administrativo/departamentos/${item.id}`"
            title="Editar"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="error"
            @click="confirmarExclusao(item)"
            title="Excluir"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </base-table>
    </base-card>
    
    <!-- Dialog de confirmação de exclusão -->
    <base-dialog
      v-model="dialogExclusao"
      title="Confirmar exclusão"
      max-width="400px"
    >
      <p>Deseja realmente excluir o departamento <strong>{{ departamentoSelecionado?.nome }}</strong>?</p>
      <p class="na-mt-2">Esta ação não poderá ser desfeita.</p>
      
      <template #actions>
        <v-btn color="default" variant="text" @click="dialogExclusao = false">
          Cancelar
        </v-btn>
        <v-btn color="error" @click="excluirDepartamento" :loading="excluindo">
          Excluir
        </v-btn>
      </template>
    </base-dialog>
    
    <!-- Snackbar para notificações -->
    <base-snackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      :color="snackbar.color"
    ></base-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'
import departamentoService, { Departamento } from '../services/departamentoService'
import empresaService, { Empresa } from '../services/empresaService'

export default defineComponent({
  name: 'Departamentos',
  components: {
    BaseCard,
    BaseTable,
    BaseDialog,
    BaseSnackbar
  },
  setup() {
    const departamentos = ref<Departamento[]>([])
    const empresas = ref<Empresa[]>([])
    const loading = ref(true)
    const search = ref('')
    const empresaFiltro = ref<number | null>(null)
    const dialogExclusao = ref(false)
    const departamentoSelecionado = ref<Departamento | null>(null)
    const excluindo = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Definição das colunas da tabela
    const headers = [
      { title: 'Nome', key: 'nome' },
      { title: 'Empresa', key: 'empresaNome' },
      { title: 'Ações', key: 'acoes', sortable: false }
    ]
    
    // Filtra departamentos por empresa
    const departamentosFiltrados = computed(() => {
      if (!empresaFiltro.value) return departamentos.value
      
      return departamentos.value.filter(d => d.empresaId === empresaFiltro.value)
    })
    
    // Carrega a lista de departamentos
    const carregarDepartamentos = async () => {
      loading.value = true
      try {
        departamentos.value = await departamentoService.listar()
      } catch (error) {
        mostrarNotificacao('Erro ao carregar departamentos', 'error')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // Carrega a lista de empresas para o filtro
    const carregarEmpresas = async () => {
      try {
        empresas.value = await empresaService.listar()
      } catch (error) {
        console.error(error)
      }
    }
    
    // Filtra departamentos por empresa
    const filtrarPorEmpresa = async () => {
      if (!empresaFiltro.value) {
        carregarDepartamentos()
        return
      }
      
      loading.value = true
      try {
        departamentos.value = await departamentoService.listarPorEmpresa(empresaFiltro.value)
      } catch (error) {
        mostrarNotificacao('Erro ao filtrar departamentos', 'error')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // Confirma a exclusão de um departamento
    const confirmarExclusao = (departamento: Departamento) => {
      departamentoSelecionado.value = departamento
      dialogExclusao.value = true
    }
    
    // Exclui o departamento selecionado
    const excluirDepartamento = async () => {
      if (!departamentoSelecionado.value?.id) return
      
      excluindo.value = true
      try {
        await departamentoService.remover(departamentoSelecionado.value.id)
        mostrarNotificacao('Departamento excluído com sucesso')
        dialogExclusao.value = false
        carregarDepartamentos()
      } catch (error) {
        mostrarNotificacao('Erro ao excluir departamento', 'error')
        console.error(error)
      } finally {
        excluindo.value = false
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
    
    // Carrega os dados ao montar o componente
    onMounted(() => {
      carregarDepartamentos()
      carregarEmpresas()
    })
    
    return {
      departamentos,
      departamentosFiltrados,
      empresas,
      loading,
      search,
      empresaFiltro,
      headers,
      dialogExclusao,
      departamentoSelecionado,
      excluindo,
      snackbar,
      filtrarPorEmpresa,
      confirmarExclusao,
      excluirDepartamento
    }
  }
})
</script>